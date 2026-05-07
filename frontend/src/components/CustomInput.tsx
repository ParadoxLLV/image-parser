import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../helpers/utils/cn';

const inputVariants = cva(
  'p-3 focus:outline-0 rounded-md w-full border-2 dark:text-text text-text-dark transition',
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

type inputVariantProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    icon?: React.ReactNode;
  };

const CustomInput = ({
  placeholder,
  variant,
  textSize,
  icon,
  className,
  type,
  ...props
}: inputVariantProps) => {
  return (
    <div className='flex items-center'>
      <span className="absolute py-3 px-3 text-text-dark dark:text-text">
        {icon && icon}
      </span>
      <input
        className={cn(
          inputVariants({ variant, textSize }),
          className,
          icon && 'pl-10'
        )}
        type={type ? type : 'text'}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default CustomInput;
