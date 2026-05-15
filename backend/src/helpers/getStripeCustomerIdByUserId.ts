import type { PoolClient } from "pg"
import { stripe } from "./stripe"

export const getStripeCustomerIdByUserId = async (userId: number, client: PoolClient) => {
    const user = await client.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (user.rowCount == 0) {
        return null;
    }
    return user.rows[0].stripe_customer_id;
}