import type { PoolClient } from "pg"
import { stripe } from "./stripe"

export const getStripeCustomerIdByUserId = async (userId: number, client: PoolClient) => {
    const userSubscription = await client.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userSubscription.rowCount == 0) {
        return null;
    }
    return userSubscription.rows[0].stripe_customer_id;
}