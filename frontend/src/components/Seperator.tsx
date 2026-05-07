import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react'
import { cn } from '../helpers/utils/cn';

const seperatorVariants = cva(
  'flex flex-1 rounded-full',
  {
    variants: {
      variant: {
        default:
          'bg-black/40 dark:bg-white/40 dark:border-zinc-400 border-zinc-700',
      },
      size: {
        sm: 'h-[2px] nth-[1]:mr-2 nth-[3]:ml-2',
        md: 'h-[3px] nth-[1]:mr-2 nth-[3]:ml-2',
        lg: 'h-[4px] nth-[1]:mr-3 nth-[3]:ml-3',
        xl: 'h-[5px] nth-[1]:mr-3 nth-[3]:ml-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

type seperatorProps = VariantProps<typeof seperatorVariants> & {
    text: string;
    leftPadding?: number;
    rightPadding?: number;
    className?: string;
}

const Seperator = ({variant, size, text, leftPadding, rightPadding, className}: seperatorProps) => {
  return (
    <div className="flex w-full items-center py-1">
        <div className={`${cn(seperatorVariants({variant, size}), text, className)}`}></div>
        <span className='dark:text-text-dark text-text'>{text}</span>
        <div className={`${cn(seperatorVariants({variant, size}), text, className)}`}></div>
    </div>
  )
}

export default Seperator