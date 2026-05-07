import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../helpers/utils/cn';
import { CgSpinnerAlt } from "react-icons/cg";

const SpinnerVariants = cva('', {
  variants: {
    variant: {
      default: 'text-white dark:text-primary',
      reverseDefault: 'dark:text-white text-primary'
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
      xxl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export type spinnerProps = VariantProps<typeof SpinnerVariants> & {
  className?: string;
};

export const Spinner = ({ size, variant, className }: spinnerProps) => {
  return (
    <div className="flex gap-2">
      <CgSpinnerAlt className={`${cn(SpinnerVariants({variant, size}), className)} animate-spin [animation-timing-function:cubic-bezier(0.6,0.8,1,0.7)]`} />
    </div>
  );
};
