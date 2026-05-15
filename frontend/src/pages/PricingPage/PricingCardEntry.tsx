import React from 'react';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';

type PricingCardEntryProps = React.HTMLAttributes<HTMLDivElement> & {
  entry: Record<string, boolean | number>
};

const PricingCardEntry = ({ entry }: PricingCardEntryProps) => {
  return (
    <div className="w-full border-2 dark:border-white/10 border-black/10 rounded-lg p-2">
      {Object.entries(entry).map(([feature, value]) => (
        <div
          key={feature}
          className="flex text-text dark:text-text-dark justify-between py-1"
        >
          <span className="select-none">{feature}</span>
          <span>
            {typeof value === 'boolean' ? (
              value ? (
                <IoMdCheckmark className="dark:text-accent-dark text-xl text-accent" />
              ) : (
                <IoMdClose className="dark:text-error-dark text-xl text-error" />
              )
            ) : (
              value
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PricingCardEntry;
