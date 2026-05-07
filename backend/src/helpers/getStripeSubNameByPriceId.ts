
export const getStripeSubNameByPriceId = (priceId: string) => {
  const subToPriceId = {
    [process.env.STRIPE_PLUS_PRICE_ID as string]: 'plus',
    [process.env.STRIPE_PREMIUM_PRICE_ID as string]: 'premium',
    [process.env.STRIPE_PRO_PRICE_ID as string]: 'pro',
  } as const;

  const subName = subToPriceId[priceId];
  if (!subName) {
    return null;
  }
  return subName;
};
