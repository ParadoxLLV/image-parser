import type { PoolClient } from 'pg';
import type Stripe from 'stripe';
import { stripe } from '../stripe';
import { updateSubscription } from '../updateSubscription';
import { getUserSubProductInfo } from '../getUserSubProductInfo';

export const handleInvoiceFailed = async (
  event: Stripe.Invoice,
  client: PoolClient,
) => {
  const email = event?.customer_email;
  if (!email) {
    throw new Error('Customer email not found');
  }
  try {
    const subscription = await getUserSubProductInfo(
      event.customer as string,
      client,
    );
    if (!subscription) {
      throw new Error('user has no associated subscription');
    }
    // When a subscription renewal fails, we want to set the user's subscription BACK to free.
    const result = await client.query("UPDATE users SET subscription = $1, updated_at = NOW() WHERE email = $2", ['free', email]);

    if (result.rowCount === 0) {
      throw new Error("Couldn't find the corresponding user to this subscription. [handleInvoiceFailed]");
    }
    /*
      When a subscription renewal fails, we want to set the corresponding subscription's TYPE to free, STATUS to canceled, CURRENT_PERIOD_START to null, CURRENT_PERIOD_END to null, CANCELLED_AT to now(), STRIPE_PRICE_ID to null. STRIPE_SUBSCRIPTION_ID can stay the same since we can easily reference this subscription later on if the user decides to reupgrade.
    */
    await client.query(
      'UPDATE subscriptions SET updated_at = NOW(), cancelled_at = NOW(), status = $1, subscription_type = $2, stripe_price_id = $3, current_period_start = $4, current_period_end = $5 WHERE stripe_subscription_id = $6',
      ['canceled', 'free', null, null, null, subscription.id],
    );
  } catch (error) {
    console.error('Error in handleInvoiceFailed:', error);
    throw error;
  }
};
