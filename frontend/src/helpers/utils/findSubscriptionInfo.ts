import type { subscriptionType } from '../../lib/types';
import { subscriptions } from '../../lib/pricingTiersFeatures';

const findSubscriptionInfo = (type: subscriptionType) => {
  const subscription = subscriptions.find((sub) => sub.name == type);
  if (!subscription) {
    return null;
  }
  return subscription;
};

export default findSubscriptionInfo;
