import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../helpers/utils/cn';

const CustomDropdownEntryVariants = cva('p-2 transition duration-300 flex justify-between items-center cursor-pointer gap-2', {
  variants: {
    variant: {
      default: 'dark:bg-teal-700 bg-teal-700 hover:dark:bg-teal-600 hover:bg-teal-600',
    },
    iconSize: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    iconSize: 'md',
  },
});

type CustomDropdownEntryProps = VariantProps<typeof CustomDropdownEntryVariants> & {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  handleClickOptionBtn: () => void;
};

const CustomDropdownEntry = ({
  onClick,
  className,
  children,
  variant,
  iconSize,
  icon,
  handleClickOptionBtn,
}: CustomDropdownEntryProps) => {
  return (
    <div
      className={cn(CustomDropdownEntryVariants({ variant, iconSize }), className)}
      onClick={() => {
        onClick();
        handleClickOptionBtn();
      }}
    >
      {children}
      {icon && (
        <span>
          {icon}
        </span>
      )}
    </div>
  );
};

export default CustomDropdownEntry;
