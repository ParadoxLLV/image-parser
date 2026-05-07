import type { PoolClient } from "pg";

export const getUserById = async (userId: string, client: PoolClient) =>  {
    return (await client.query("SELECT * FROM users WHERE id = $1", [userId])).rows[0] ?? null;
}