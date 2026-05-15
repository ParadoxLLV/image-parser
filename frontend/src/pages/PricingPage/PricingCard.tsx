import React, { type JSX } from 'react';

type PricingCardsProps = {
  title: JSX.Element | string;
  description: string;
  children?: React.ReactNode;
  seperator?: boolean;
};

const PricingCard = ({
  title,
  description,
  children,
  seperator,
}: PricingCardsProps) => {
  return (
    <div className="dark:hover:bg-accent-dark/5 hover:bg-accent/5 transition-all duration-300 w-full grow flex flex-col p-3 rounded-lg border-2 border-accent gap-3 dark:border-accent-dark justify-between">
      <h1 className="text-3xl text-text dark:text-text-dark">{title}</h1>
      <span className="text-lg text-text dark:text-text-dark text-center w-full">
        {description}
      </span>
      <div className="flex flex-col gap-3">
        {seperator && (
          <div className="w-full h-[2px] rounded-full bg-accent dark:bg-accent-dark"></div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PricingCard;
