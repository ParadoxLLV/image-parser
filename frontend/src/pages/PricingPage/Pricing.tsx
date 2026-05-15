import { useState } from 'react';
import { CustomButton } from '../../components/CustomButton';
import PricingCard from './PricingCard';
import { credits, subscriptions } from '../../lib/pricingTiersFeatures';
import { FaStar } from 'react-icons/fa';
import PricingCardEntry from './PricingCardEntry';
import { Outlet, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppSelector } from '../../Redux/reduxHooks/reduxHooks';
import toast from 'react-hot-toast';
import type { AuthUser, creditType, subscriptionType } from '../../lib/types';
import { findCreditInfo } from '../../helpers/utils/findCreditInfo';
import findSubscriptionInfo from '../../helpers/utils/findSubscriptionInfo';
import { pay } from '../../helpers/utils/pay';
import type { UserSchema } from '../../helpers/Schemas/userSchema';

const Pricing = () => {
  const [active, setActive] = useState('Monthly');

  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const buttons = ['Monthly', 'One-time'];

  return (
    <motion.div className="flex justify-center w-full py-6 flex-col gap-3">
      <h1 className="text-3xl text-text dark:text-text-dark text-center">
        Explore all the available plans and offers that Image Parser offers
      </h1>
      <div className="flex gap-3 w-full justify-center py-3">
        <div className="p-1 border-2 shadow-lg hover:shadow-none duration-300 inset-shadow-4sm inset-shadow-accent shadow-accent/50 rounded-lg border-accent flex gap-2">
          {buttons.map((button, id) => (
            <CustomButton
              className={`${
                active === button
                  ? 'bg-accent-dark dark:bg-accent-dark'
                  : 'bg-accent dark:bg-accent'
              }`}
              key={id}
              onClick={() => setActive(button)}
            >
              {button}
            </CustomButton>
          ))}
        </div>
      </div>
      {active === 'Monthly' ? (
        <div className="w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid gap-3">
          {subscriptions.map((subscription) => (
            <PricingCard
              seperator
              title={
                <div className="flex items-center justify-center gap-3 w-full">
                  <h1>
                    {subscription.name
                      .split('')
                      .map((char, index) =>
                        index == 0 ? char.toUpperCase() : char,
                      )
                      .join('')}
                  </h1>
                  <FaStar
                    className={`${subscription.name === 'plus' && 'text-amber-500'} ${subscription.name === 'premium' && 'text-blue-500'} ${subscription.name === 'pro' && 'text-emerald-500'} text-2xl`}
                  />
                </div>
              }
              description={subscription.description}
            >
              <PricingCardEntry
                entry={subscription.features}
              ></PricingCardEntry>
              <CustomButton
                onClick={() => {
                  if (user.isGuest) {
                    toast.error('Either login or register to buy items');
                    navigate('/register');
                  } else if (
                    (user.user as UserSchema).subscription !== 'free'
                  ) {
                    toast.error('To update your subscription go to settings.')
                  } else {
                    const subscriptionInfo = findSubscriptionInfo(
                      subscription.name as subscriptionType,
                    );
                    if (subscriptionInfo) {
                      pay(
                        'subscription',
                        subscriptionInfo.priceId,
                        user.fingerprint!,
                      );
                    }
                  }
                }}
              >
                Buy
              </CustomButton>
            </PricingCard>
          ))}
        </div>
      ) : (
        <div className="w-full flex gap-3 sm:flex-row flex-col">
          {credits.map((credit) => (
            <PricingCard
              title={
                <div className="flex items-center justify-center gap-3 w-full">
                  <h1>{credit.credits} Credits</h1>
                </div>
              }
              description={`${credit.credits} credits to use for conversions`}
            >
              <CustomButton
                onClick={() => {
                  if (user.isGuest) {
                    toast.error('Either login or register to buy items');
                    navigate('/register');
                  } else {
                    const creditInfo = findCreditInfo(
                      credit.name as creditType,
                    );
                    if (creditInfo) {
                      pay('payment', creditInfo.priceId, user.fingerprint);
                    }
                  }
                }}
              >
                Buy
              </CustomButton>
            </PricingCard>
          ))}
        </div>
      )}
      <Outlet />
    </motion.div>
  );
};

export default Pricing;
