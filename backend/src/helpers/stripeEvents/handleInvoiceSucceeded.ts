import type Stripe from 'stripe';
import type { PoolClient } from 'pg';
import { stripe } from '../stripe';
import { getUserSubInfo } from '../getUserSubInfo';
import { getStripeSubNameByPriceId } from '../getStripeSubNameByPriceId';

export const handleInvoiceSucceeded = async (
  invoice: Stripe.Invoice,
  client: PoolClient,
) => {
  const email = invoice?.customer_email;
  if (!email) {
    throw new Error('Customer email not found');
  }
  try {
    const subscription = await getUserSubInfo(
      invoice.customer as string,
      client,
    );
    if (!subscription) {
      throw new Error('user has no associated subscription');
    }
    const subscriptionName = getStripeSubNameByPriceId(
      subscription?.data[0].items.data[0].price.id as string,
    );

    let credits: number | null;

    switch (subscriptionName) {
      case 'plus':
        credits = 250;
        break;
      case 'premium':
        credits = 500;
        break;
      case 'pro':
        credits = 1000;
        break;
      default:
        console.log(`Unknown subscription type: ${subscriptionName}`);
        return null;
    }
    console.log("BILLING REASON:", invoice.billing_reason);
    if (invoice.amount_paid > 0 && invoice.billing_reason === 'subscription_cycle') {
      const result = await client.query(
        'UPDATE users SET credits = credits + $1 WHERE email = $2 RETURNING *',
        [credits, email],
      );
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
          invoice.status === 'paid' ? 'paid' : 'unpaid',
          invoice.currency,
          invoice.total,
          invoice.payments?.data[0].payment.payment_intent,
          null,
          invoice.customer,
          subscription.data[0].id,
          result?.rows[0].id,
        ],
      );
    }
    /*
      When a subscription renewal is successful, we want to replenish the user's credits, update the associated subscription's states (updated_at, current_period_start, current_period_end).
    */
    await client.query(
      'UPDATE subscriptions SET updated_at = NOW(), current_period_start = $1, current_period_end = $2 WHERE stripe_subscription_id = $3',
      [
        new Date(
          subscription.data[0].items.data[0].current_period_start * 1000,
        ),
        new Date(subscription.data[0].items.data[0].current_period_end * 1000),
        subscription.data[0].id,
      ],
    );
  } catch (error) {
    console.error('Error in handleInvoiceSucceeded:', error);
    throw error;
  }
};
