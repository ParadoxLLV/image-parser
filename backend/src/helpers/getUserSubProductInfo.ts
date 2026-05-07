import type { PoolClient } from "pg";
import { stripe } from "./stripe";

export const getUserSubProductInfo = async (customerId: string, client: PoolClient) => {
    try {
        const subscription = await stripe.subscriptions.list({
            customer: customerId,
            limit: 1,
            status: 'active'
        })
        if (subscription.data.length === 0) {
            return null;
        }
        const product = await stripe.products.retrieve(subscription.data[0].items.data[0].price.product as string);
        console.log(`CURRENT USER SUBSCRIPTION: ${product.name}`);
        return product;
    } catch (error) {
        console.error('Error in getUserSubInfo:', error);
        throw error;
    }
}