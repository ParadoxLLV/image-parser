import type { Request, Response } from 'express';
import { pool } from '../../db/db';
import { stripe } from '../../helpers/stripe';
import { handleInvoiceSucceeded } from '../../helpers/stripeEvents/handleInvoiceSucceeded';
import { handleSessionCompleted } from '../../helpers/stripeEvents/handleSessionCompleted';
import { handleInvoiceFailed } from '../../helpers/stripeEvents/handleInvoiceFailed';
import { handleSubscriptionUpdated } from '../../helpers/stripeEvents/handleSubscriptionUpdated';
import { handleSubscriptionDeleted } from '../../helpers/stripeEvents/handleSubscriptionDeleted';

export const stripeWebhook = async (req: Request, res: Response) => {
  let webhookEvent;
  const client = await pool.connect();
  console.log('Starting stripeWebhook');
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('stripe webhook secret not found');
      return res.sendStatus(400);
    }

    const signature = req.headers['stripe-signature'];
    if (!signature) {
      throw new Error('Invalid Stripe signature');
    }
    await client.query('BEGIN');
    webhookEvent = stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    console.log('Running stripeWebhook');
    switch (webhookEvent.type) {
      case 'invoice.payment_succeeded': // event used for SUBSCRIPTION RENEWALS (not triggered on first time payment). Signifies successful money transfer to the Stripe account
        if (webhookEvent.data.object.billing_reason !== 'subscription_create') {
          await handleInvoiceSucceeded(webhookEvent.data.object, client);
        }
        break;
      case 'invoice.payment_failed': // event used for dealing with SUBSCRIPTION RENEWAL FAILURES (not triggered on first time payment).
        await handleInvoiceFailed(webhookEvent.data.object, client);
        break;
      case 'checkout.session.completed': // event used for when a checkout session is completed (triggered for both subscriptions and one-time payments).
        await handleSessionCompleted(webhookEvent.data.object, client);
        break;
      case 'customer.subscription.updated': // event used for when a customer updates his subscription (through the Stripe billing portal, fires immediately even for cancellations).
        await handleSubscriptionUpdated(
          webhookEvent,
          webhookEvent.data.object,
          client,
        );
        break;
      case 'customer.subscription.deleted': // event used for when a customer cancels (deletes) his subscription. Fires when the cancellation date is reached (if a customer cancelled on feb 3 but he got the subscription on jan 20, it will cancel on feb 20). Can be interfered with by deleting the subscription on Stripe which also sends this event
        await handleSubscriptionDeleted(webhookEvent.data.object, client);
        break;
    }
    await client.query('COMMIT');
    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Stripe webhook error', webhookEvent?.type, error);
    return res.sendStatus(400);
  } finally {
    client.release();
  }
};
