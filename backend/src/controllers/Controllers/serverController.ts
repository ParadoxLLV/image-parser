import type { databaseUser } from './../../../../frontend/src/helpers/Schemas/databaseUserSchema';
import { type SessionUser } from '../../../../frontend/src/helpers/Schemas/sessionSchema';
import { useAppDispatch } from '../../../../frontend/src/Redux/reduxHooks/reduxHooks';
import axios from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { pool } from '../../db/db';
import sharp from 'sharp';
import { Buffer } from 'buffer';
import type { PoolClient } from 'pg';
import type { UserSchema } from '../../../../frontend/src/helpers/Schemas/userSchema';
import { redisClient } from '../../../app';
import { stripe } from '../../helpers/stripe';
import type {
  lineItemType,
  subscriptionType,
} from '../../../../frontend/src/lib/types';
import type Stripe from 'stripe';
import { getStripeCustomerIdByUserId } from '../../helpers/getStripeCustomerIdByUserId';
import { getUserSubProductInfo } from '../../helpers/getUserSubProductInfo';
import { getStripeSubNameByPriceId } from '../../helpers/getStripeSubNameByPriceId';
import { Plus, Premium, Pro } from '../../lib/constantsBackend';

export const removeCredits = async (
  user: UserSchema | SessionUser,
  amount: number,
  fingerprint: string,
  client?: PoolClient,
) => {
  try {
    if (user.credits <= 0) {
      throw new Error(
        "User doesn't have enough credits for converting an image.",
      );
    }
    if (user.isGuest) {
      console.log(`guest:${fingerprint}`);
      await redisClient.hIncrBy(`guest:${fingerprint}`, 'credits', -amount);
    } else if (!user.isGuest && client) {
      const result = await client?.query(
        'UPDATE users SET credits = credits - $1 WHERE id = $2 RETURNING credits',
        [amount, user.id],
      );
      if (result?.rowCount === 0) {
        throw new Error('Logged in user not found');
      } else {
        console.log(
          `Removed ${amount} credits. User now has ${result.rows[0]} credits.`,
        );
      }
    }
    user.credits -= amount;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const removeCreditsRoute = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { amount } = req.body;
    await removeCredits(req.user, amount, req.headers.fingerprint, client);
    res
      .status(200)
      .json({ message: `successfully removed ${amount} credits}` });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: 'Something went wrong in removeCreditsRoute',
      error: error,
    });
    return;
  } finally {
    client.release();
  }
};

export const convertImage = async (req: Request, res: Response) => {
  const client = await pool.connect();
  console.log('convertImage');
  try {
    await client.query('BEGIN');
    const { convertingToFormat } = req.body;
    const file = req.file;
    console.log(file);
    console.log(convertingToFormat);
    console.log('[convertImage] FINGERPRINT', req.headers.fingerprint);
    console.log('[convertImage] USER', req.user);
    if (!file || !convertingToFormat) {
      return res.status(400).json({
        error:
          "Either the files or convertingToFormat wasn't provided [convertImage]",
      });
    }
    if (!req.user || !req.headers.fingerprint) {
      return res.status(401).json({
        error: "User or fingerprint wasn't found [convertImage]",
      });
    }
    if (req.user?.credits <= 0) {
      return res.status(400).json({
        error: "User doesn't have enough credits for converting [convertImage]",
      });
    }
    const convertedFile = await sharp(file.buffer)
      .toFormat(convertingToFormat)
      .toBuffer();

    await removeCredits(
      req.user as SessionUser | UserSchema,
      1,
      req.headers.fingerprint as string,
      client,
    );
    res.set('Content-Type', `image/${convertingToFormat}`);
    res.set(
      'Content-Disposition',
      `attachment; filename='${file.originalname[0]}.${convertingToFormat}'`,
    );

    await client.query('COMMIT');
    res.send(convertedFile);
  } catch (error) {
    await client.query('ROLLBACK');
    console.log(error);
    return res
      .status(400)
      .json({ message: 'Something went wrong [convertImage]', error });
  } finally {
    client.release();
  }
};

export const checkoutSession = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { priceId, mode } = req.body;
    if (!priceId || !mode) {
      return res.status(400).json({ error: 'Missing priceId or mode' });
    }
    if (!req.user?.id || !req.user?.email || !req.user?.username) {
      return res.status(400).json({ error: 'no user found' });
    }

    let customerId = await getStripeCustomerIdByUserId(req.user.id, client);

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: req.user?.username,
        email: req.user?.email,
        metadata: {
          id: String(req.user?.id),
        },
      });

      customerId = customer.id;
      await client.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customer.id, req.user.id],
      );
    }

    if (mode === 'subscription') {
      const currentSub = await getUserSubProductInfo(customerId, client);
      if (currentSub?.name && currentSub.name !== 'free') {
        return res.status(400).json({
          error: 'User already has a subscription',
          subscription: currentSub?.name as subscriptionType,
        });
      } else {
        console.log(
          '[ CHECKOUT SESSION CHECK ] USER DOESNT HAVE AN ACTIVE SUBSCRIPTION',
        );
      }
    }

    const currentSubscription = req.user.subscription;
    console.log('CURRENT SUBSCRIPTION', currentSubscription);
    let coupon;
    switch (currentSubscription) {
      case 'premium':
        coupon = await stripe.coupons.create({
          percent_off: Premium.discountsOnCredits * 100,
          duration: 'forever',
        });
        break;
      case 'pro':
        coupon = await stripe.coupons.create({
          percent_off: Pro.discountsOnCredits * 100,
          duration: 'forever',
        });
        break;
      default:
        break;
    }
    console.log('Coupon', coupon);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      metadata: {
        userId: String(req.user.id),
        name: req.user.username,
        mode: mode,
        customerId,
      },
      discounts: [
        {
          coupon: coupon?.id,
        },
      ],
      customer: customerId,
      payment_method_types: ['card'],
      success_url: `${process.env.FRONTEND_URL}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/stripe-fail`,
    });
    console.log(`CHECKOUT SESSION URL : ${session.url}`);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error in checkoutSession:', error);
    return res.status(400).json({ error: 'Failed to create checkout session' });
  } finally {
    client.release();
  }
};

export const getCheckoutInfo = async (req: Request, res: Response) => {
  try {
    const { checkoutUrl } = req.body;

    console.log(`Checkout url ${checkoutUrl}`);

    if (!checkoutUrl) {
      return res.status(404).json({ err: 'No checkout url was provided' });
    }

    const sessionData = await stripe.checkout.sessions.retrieve(checkoutUrl);

    if (!sessionData) {
      return res.status(401).json({ message: 'Stripe session not found' });
    }

    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(
      checkoutUrl,
      {
        expand: ['data.price.product'],
      },
    );

    const products: lineItemType[] = await Promise.all(
      lineItemsResponse.data.map(async (lineItem) => {
        const item = lineItem.price?.product as Stripe.Product;
        return {
          name: item.name,
          price: lineItem.price?.unit_amount! / 100,
          image: item.images[0],
          description: item.description!,
          currency: lineItem.price?.currency!,
        };
      }),
    );

    const amount = sessionData.amount_total;
    const email = sessionData.customer_details?.email;

    console.log(`amount ${amount}`);
    console.log(`email ${email}`);

    const checkoutData = {
      products,
      amount,
      email,
    };

    return res
      .status(200)
      .json({ checkoutData, message: 'Checkout info retrieved successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: error });
  }
};
