import { cva, type VariantProps } from 'class-variance-authority';
import React, { type ReactNode } from 'react';
import { cn } from '../helpers/utils/cn';

const alertVariants = cva(
  'rounded-md w-full dark:text-text text-text-dark border-2 my-2 transition',
  {
    variants: {
      variant: {
        default: 'dark:bg-accent-dark dark:border-accent bg-accent border-accent-dark',
        error: 'dark:bg-error-dark dark:border-red-300 bg-error border-red-900',
        alert: 'bg-amber-500 dark:bg-amber-200 dark:border-amber-400 border-amber-300',
      },
      textSize: {
        sm: 'text-sm',
        md: 'text-md',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      textSize: 'md',
    },
  }
);

type customAlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

const CustomAlert = ({ children, icon, className, variant, textSize }: customAlertProps) => {
  return (
    <div className={cn(alertVariants({ variant, textSize }), className, 'flex items-center')}>
      {icon && <span className='p-3'>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

export default CustomAlert;
