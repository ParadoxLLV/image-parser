import React, { useState } from 'react';
import { cn } from '../helpers/utils/cn';
import CustomDropdownEntry from './CustomDropdownEntry';
import { CustomButton } from './CustomButton';
import { AnimatePresence, motion } from 'motion/react';

type Option = {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

type CustomDropdownProps = React.HTMLAttributes<HTMLButtonElement> & {
  options: Option[];
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

const CustomDropdown = ({
  options,
  children,
  icon,
  className,
  ...props
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleClickOptionBtn = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };
  const customDropdownContent = (
    <motion.div
      className="absolute flex flex-col min-w-full w-max z-50"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeIn' }}
      exit={{ y: -10, opacity: 0 }}
    >
      {options.map((option) => (
        <CustomDropdownEntry
          handleClickOptionBtn={handleClickOptionBtn}
          icon={option.icon && option.icon}
          className={option.className}
          onClick={option.onClick && option.onClick}
        >
          <span className='leading-none flex'>{option.children}</span>
        </CustomDropdownEntry>
      ))}
    </motion.div>
  );
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      className={cn('relative', className)}
    >
      <CustomButton className="cursor-auto" icon={icon && icon} {...props}>
        {children}
      </CustomButton>
      <AnimatePresence>{isOpen && customDropdownContent}</AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
