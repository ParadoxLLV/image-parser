import { useState, type Dispatch, type SetStateAction } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FaCaretUp } from 'react-icons/fa';

type Option = {
  optionValue: string;
  optionIcon?: React.ReactNode;
  optionTooltip?: string;
};

type CustomSelectProps = {
  setValue?: Dispatch<SetStateAction<string>> | null;
  value?: string;
  options: Option[];
  children: React.ReactNode;
};

const CustomSelect = ({
  setValue = null,
  value = '',
  options,
  children,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownContent = (
    <AnimatePresence>
      <motion.div
        transition={{ duration: 0.3, ease: 'easeIn' }}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        className="w-full absolute top-10 left-0 rounded-lg z-[9999]"
      >
        {options.map((option) => (
          <div
            onClick={() => {
              setValue && setValue(option.optionValue);
              setIsOpen((prev) => !prev);
            }}
            className="p-2 cursor-pointer transition duration-300 dark:bg-teal-900 bg-teal-300 dark:hover:bg-teal-700 hover:bg-teal-500"
          >
            <span>{option.optionValue}</span>
            {option.optionIcon && <span>{option.optionIcon}</span>}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="w-full flex flex-col relative select-none">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex justify-between items-center dark:bg-teal-900 bg-teal-300 p-2"
      >
        <span>{value?.length > 0 ? value : children}</span>
        <span className={`transition duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <FaCaretUp />
        </span>
      </div>
      {isOpen && dropdownContent}
    </div>
  );
};

export default CustomSelect;
