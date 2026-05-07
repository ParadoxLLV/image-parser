import type { PoolClient } from 'pg';
import { getStripeSubNameByPriceId } from '../getStripeSubNameByPriceId';
import { stripe } from '../stripe';
import type Stripe from 'stripe';

export const handleSubscriptionUpdated = async (
  event: Stripe.CustomerSubscriptionUpdatedEvent,
  subscription: Stripe.Subscription,
  client: PoolClient,
) => {
  if (!subscription.customer) {
    throw new Error('Missing customer id from subscription');
  }

  try {
    const updatedProductName = getStripeSubNameByPriceId(
      subscription.items.data[0].price.id as string,
    );
    if (!updatedProductName) {
      throw new Error("Subscription with the provided name wasn't found");
    }

    let newSubscriptionStatus: string;
    if (subscription.cancel_at_period_end || subscription.status === 'active') {
      newSubscriptionStatus = 'active';
    } else {
      newSubscriptionStatus = 'canceled';
    }

    let cancelled_at: Date | null = null;
    if (subscription.canceled_at) {
      cancelled_at = new Date(subscription.canceled_at * 1000);
      console.log('Setting cancelled_at to: ', cancelled_at);
    }

    console.log('Updating subscription with:', {
      updatedProductName,
      newSubscriptionStatus,
      current_period_start: new Date(
        subscription.items.data[0].current_period_start * 1000,
      ),
      current_period_end: new Date(
        subscription.items.data[0].current_period_end * 1000,
      ),
      cancelled_at,
      priceId: subscription.items.data[0].price.id,
    });

    const subResult = await client.query(
      `UPDATE subscriptions 
           SET updated_at = NOW(), 
               subscription_type = $1, 
               status = $2, 
               current_period_start = $3, 
               current_period_end = $4, 
               cancelled_at = $5, 
               stripe_price_id = $6 
           WHERE stripe_subscription_id = $7`,
      [
        updatedProductName,
        newSubscriptionStatus,
        new Date(subscription.items.data[0].current_period_start * 1000),
        new Date(subscription.items.data[0].current_period_end * 1000),
        cancelled_at,
        subscription.items.data[0].price.id,
        subscription.id,
      ],
    );

    if (subResult.rowCount === 0) {
      throw new Error(
        `Subscription with stripe_subscription_id ${subscription.id} wasn't found in database.`,
      );
    }

    const userResult = await client.query(
      'UPDATE users SET subscription = $1, updated_at = NOW() WHERE stripe_customer_id = $2',
      [updatedProductName, subscription.customer],
    );

    if (userResult.rowCount === 0) {
      throw new Error(
        `User with stripe_customer_id ${subscription.customer} wasn't found in database.`,
      );
    }

    console.log('Subscription updated successfully');
  } catch (error) {
    console.error(
      '[handleSubscriptionUpdated]: Subscription update webhook failed:',
      error,
    );
    throw error;
  }
};
