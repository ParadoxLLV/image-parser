import type { PoolClient } from "pg";
import { stripe } from "./stripe";

export const getUserSubInfo = async (customerId: string, client: PoolClient) => {
    try {
        const subscription = await stripe.subscriptions.list({
            customer: customerId,
            limit: 1,
            status: 'active'
        })
        if (subscription.data.length === 0) {
            return null;
        }
        return subscription;
    } catch (error) {
        console.error('Error in getUserSubInfo:', error);
        throw error;
    }
}