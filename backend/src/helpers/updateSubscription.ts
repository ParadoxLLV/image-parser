import type { PoolClient } from 'pg';
import type { subscriptionType } from '../../../frontend/src/lib/types';
import { Free, Plus, Premium, Pro } from '../lib/constantsBackend';

export const updateSubscription = async (
  subscription: subscriptionType,
  client: PoolClient,
  id?: number,
  email?: string,
) => {
  let credits;
  switch (subscription) {
    case 'plus':
      credits = Plus.monthlyCredits
      break;
    case 'premium':
      credits = Premium.monthlyCredits
      break;
    case 'pro':
      credits = Pro.monthlyCredits
      break;
    default:
      credits = Free.monthlyCredits
      break;
  }
  console.log("updateSubscription credits given", credits);
  try {
    if (id && !email) {
      await client.query('UPDATE users SET subscription = $1, updated_at = NOW(), credits = credits + $2 WHERE id = $3', [
        subscription,
        credits,
        id,
      ]);
    } else if (!id && email) {
      await client.query('UPDATE users SET subscription = $1, updated_at = NOW(), credits = credits + $2 WHERE email = $3', [
        subscription,
        credits,
        email,
      ]);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
