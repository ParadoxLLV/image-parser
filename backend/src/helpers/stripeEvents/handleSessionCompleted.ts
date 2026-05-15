import type { PoolClient } from 'pg';
import type Stripe from 'stripe';
import { stripe } from '../stripe';
import { updateSubscription } from '../updateSubscription';
import type { subscriptionType } from '../../../../frontend/src/lib/types';
import { getStripeCreditsByPriceId } from '../getStripeCreditsByPriceId';

export const handleSessionCompleted = async (
  event: Stripe.Checkout.Session,
  client: PoolClient,
) => {
  const userId = Number(event.metadata?.userId);
  if (!userId) throw new Error('Missing userId');

  try {
    console.log('handleSessionCompleted Customer', event.customer);
    let subscriptionId = null;

    if (event.mode === 'subscription') {
      const subscription = await stripe.subscriptions.retrieve(
        event.subscription as string,
      );
      const product = await stripe.products.retrieve(
        subscription.items.data[0].price.product as string,
      );
      subscriptionId = subscription.id;
      await client.query(
        `INSERT INTO subscriptions (
          current_period_start,
          current_period_end,
          status,
          subscription_type,
          stripe_price_id,
          stripe_subscription_id,
          user_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (stripe_subscription_id) DO UPDATE SET
          current_period_start = EXCLUDED.current_period_start,
          current_period_end = EXCLUDED.current_period_end,
          status = EXCLUDED.status,
          subscription_type = EXCLUDED.subscription_type,
          stripe_price_id = EXCLUDED.stripe_price_id,
          stripe_subscription_id = EXCLUDED.stripe_subscription_id
          `,
        [
          new Date(subscription.items.data[0].current_period_start * 1000),
          new Date(subscription.items.data[0].current_period_end * 1000),
          subscription.status,
          product.name.toLowerCase(),
          product.default_price,
          subscription.id,
          userId,
        ],
      );

      await updateSubscription(
        product.name.toLowerCase() as subscriptionType,
        client,
        userId,
      );
    } else {
      const lineItems = await stripe.checkout.sessions.listLineItems(event.id);
      const creditAmount = getStripeCreditsByPriceId(
        lineItems.data[0].price?.id as string,
      );
      console.log('Credit amount: ', creditAmount);
      await client.query(
        'UPDATE users SET credits = credits + $1 WHERE stripe_customer_id = $2',
        [creditAmount, event.customer],
      );
    }

    await client.query(
      `INSERT INTO payments (
          status,
          currency,
          amount, 
          stripe_payment_id,
          stripe_checkout_id,
          stripe_customer_id,
          subscription_id,
          user_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        event.payment_status,
        event.currency,
        event.amount_total,
        event.payment_intent,
        event.id,
        event.customer,
        subscriptionId,
        userId,
      ],
    );
  } catch (err) {
    console.error('Error in handleSessionCompleted:', err);
    throw err;
  }
};
