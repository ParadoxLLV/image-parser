import { credits } from '../../lib/pricingTiersFeatures';
import type { creditType } from '../../lib/types';

export const findCreditInfo = (type: creditType) => {
  const foundCredit = credits.find((credit) => credit.name == type);
  if (!foundCredit) {
    return null;
  }
  return foundCredit;
};
