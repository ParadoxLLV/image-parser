import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../helpers/utils/cn';

type CustomToggleProps = React.HTMLAttributes<HTMLDivElement> & {
    currValue: boolean;
}

const CustomToggle = ({ onClick, currValue }: CustomToggleProps) => {
  const [enabled, setEnabled] = useState<boolean>(currValue);
  return (
    <motion.div
      onClick={(e) => {
        onClick?.(e);
        setEnabled(!enabled);
      }}
      whileHover={{scale: 1.05}}
      whileTap={{scale: 0.9}}
      transition={{type: 'spring', stiffness: 250, damping: 15}}
      layout
      className={`rounded-2xl transition duration-400 p-1 w-11 h-full bg-teal-700 flex ${enabled ? cn('justify-end', 'bg-teal-500!') : 'justify-start'} items-center cursor-pointer`}
    >
      <motion.div layout className={`rounded-full bg-white w-4 h-4`}></motion.div>
    </motion.div>
  );
};

export default CustomToggle;
