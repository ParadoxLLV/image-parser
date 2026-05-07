import { cva, type VariantProps } from 'class-variance-authority';
import React, { useState, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../helpers/utils/cn';
import { Spinner } from './Spinner/Spinner';

const buttonVariants = cva(
  'flex items-center cursor-pointer justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-85 duration-300 transition rounded-md border-2 p-2 dark:text-text text-text-dark h-full',
  {
    variants: {
      variant: {
        default:
          'bg-primary dark:bg-primary-dark dark:border-secondary border-secondary-dark',
        danger:
          'bg-error dark:bg-error-dark dark:border-red-500 border-red-300',
        cautious:
          'bg-yellow-500 dark:bg-amber-200 dark:border-yellow-500 border-amber-300',
        forSelecting:
          'bg-zinc-500 text-text-dark dark:text-text-dark dark:bg-zinc-700 dark:border-zinc-500 border-zinc-400',
      },
      textSize: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        xxl: 'text-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      textSize: 'md',
    },
  },
);

type buttonVariantProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children?: ReactNode;
    className?: string;
    isLoading?: boolean;
    icon?: ReactNode;
    rightIcon?: boolean;
    tooltipText?: string;
  };

export const CustomButton = ({
  children,
  variant,
  textSize,
  isLoading,
  className,
  icon,
  rightIcon,
  ...props
}: buttonVariantProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <button
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        buttonVariants({ variant, textSize }),
        className,
        `${isLoading && 'hover:opacity-20 cursor-not-allowed opacity-20'}`,
      )}
      {...props}
    >
      {isLoading && (
        <div className="flex gap-2">
          <span>Loading</span>
          <Spinner size={textSize} />
        </div>
      )}
      {!isLoading && !rightIcon && icon && <span>{icon}</span>}
      {!isLoading && <span>{children}</span>}
      {!isLoading && rightIcon && icon && <span>{icon}</span>}
    </button>
  );
};
