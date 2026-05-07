import { getStripeSubNameByPriceId } from './../getStripeSubNameByPriceId';
import type { PoolClient } from 'pg';
import type Stripe from 'stripe';
export const handleSubscriptionDeleted = async (subscription: Stripe.Subscription, client: PoolClient) => {
    try {
        const customerId = subscription.customer;
        if (!customerId) {
            throw new Error(`Unknown customer found at [handleSubscriptionDeleted].`);
        }
        let subscriptionStatus: string;
        if (subscription.status === 'active') {
            subscriptionStatus = 'active';
        } else {
            subscriptionStatus = 'canceled';
        }
        // If a subscription is cancelled, we want to update it's updated_at to now(), subscription_type to free, status to canceled, current_period_start to null, current_period_end to null, cancelled_at to now() or use Stripe's date, stripe_price_id to null.
        const result = await client.query("UPDATE subscriptions SET updated_at = NOW(), subscription_type = $1, status = $2, current_period_start = $3, current_period_end = $4, cancelled_at = $5, stripe_price_id = $6 WHERE stripe_subscription_id = $7", ["free", subscriptionStatus, null, null, new Date(subscription.canceled_at as number * 1000), null, subscription.id])

        if (result.rowCount === 0) {
            throw new Error(`Subscription wasn't found [handleSubscriptionDeleted].`);
        }

        const result2 = await client.query("UPDATE users SET subscription = $1, updated_at = NOW() WHERE stripe_customer_id = $2", ["free", customerId]);

        if (result2.rowCount === 0) {
            throw new Error(`User wasn't found [handleSubscriptionDeleted].`);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}