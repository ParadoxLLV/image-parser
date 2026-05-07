
export const getStripeCreditsByPriceId = (priceId: string) => {
  const creditsToPriceId = {
    [process.env.STRIPE_1000_CREDITS_PRICE_ID as string]: 1000,
    [process.env.STRIPE_500_CREDITS_PRICE_ID as string]: 500,
    [process.env.STRIPE_250_CREDITS_PRICE_ID as string]: 250,
  } as const;

  console.log(
    '1000 credits price id:',
    process.env.STRIPE_1000_CREDITS_PRICE_ID,
  );
  console.log('PRICE ID:', priceId);
  const credits = creditsToPriceId[priceId];
  if (!credits) {
    return null;
  }
  return credits;
};
