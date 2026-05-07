import type { PoolClient } from 'pg';

export const addCredits = async (
  client: PoolClient,
  amount: number,
  userId: number,
) => {
  try {
    console.log(`addCredits amount ${amount}`);
    await client.query(
      'UPDATE users SET credits = credits + $1 WHERE id = $2',
      [amount, userId],
    );
  } catch (error) {
    console.error('Error in addCredits:', error);
    throw error;
  }
};
