import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../helpers/utils/cn';

const CustomLinkVariants = cva(
  'group transition duration-300 px-1',
  {
    variants: {
      variant: {
        default: 'hover:text-gray-500 dark:hover:text-white dark:text-neutral-300 text-neutral-700',
        green: 'hover:text-teal-800 dark:hover:text-teal-500 dark:text-teal-600 text-teal-900',
        red: 'hover:text-red-800 dark:hover:text-red-500',
      },
      textSize: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      textSize: 'md',
    },
  }
);

const UnderlineVariants = cva(
  'h-[1px] w-0 group-hover:w-full transition-all duration-300',
  {
    variants: {
      lineVariant: {
        default: 'bg-gray-300 dark:bg-gray-200',
        green: 'bg-teal-800 dark:bg-teal-500',
        red: 'bg-red-800 dark:bg-red-500',
      },
    },
    defaultVariants: {
      lineVariant: 'default',
    },
  }
);

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof CustomLinkVariants> &
  VariantProps<typeof UnderlineVariants> & {
    to?: string;
    children: React.ReactNode;
    className?: string;
  };

const CustomLink = ({
  to,
  children,
  className,
  variant,
  lineVariant,
  textSize,
  ...props
}: CustomLinkProps) => {
  return (
    <a
      {...props}
      className={cn(
        CustomLinkVariants({ variant, textSize }),
        className,
        'inline-flex flex-col'
      )}
      href={to ?? '#'}
    >
      <p>{children}</p>
      <div className={UnderlineVariants({ lineVariant })} />
    </a>
  );
};

export default CustomLink;