import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';
import { RxCross2 } from 'react-icons/rx';
import { toggleModal } from '../../Redux/reducers/modalReducer';
import Seperator from '../Seperator';
import ModalTabContainer from './ModalTabContainer';
import ModalTab from './ModalTab';
import { cn } from '../../helpers/utils/cn';

type TabContent = {
  content: React.ReactNode;
  seperatorText?: string;
};

type TabConfig = {
  label: string;
  tabContent: TabContent;
};

type CustomModalProps = {
  modalName: string;
  children?: React.ReactNode;
  seperatorText?: string;
  tabs?: TabConfig[];
};

const CustomModal = ({
  modalName,
  children,
  seperatorText,
  tabs,
}: CustomModalProps) => {
  const modalSelected = useAppSelector((state) => state.modal[modalName]);
  const dispatch = useAppDispatch();

  const closeModal = (e) => {
    e.preventDefault();
    dispatch(toggleModal(modalName));
  };

  const [activeTab, setActiveTab] = useState<null | TabConfig>(
    (tabs && tabs[0]) ?? null,
  );

  const activeTabContent =
    tabs && tabs.find((tab) => tab.label == activeTab!.label)?.tabContent;
  return (
    <>
      <AnimatePresence>
        {modalSelected && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
            exit={{ opacity: 0, y: -30 }}
            onClick={(e) => closeModal(e)}
            className="fixed z-[99999] top-0 left-0 flex justify-center items-center min-w-screen min-h-screen bg-black/60"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="h-[50vh] w-full mx-4 max-w-sm md:max-w-lg lg:max-w-2xl flex flex-col"
            >
              <div className="w-full rounded-t-md dark:bg-teal-700 bg-accent-dark min-h-10 flex justify-end pl-4 items-center">
                <span
                  onClick={(e) => closeModal(e)}
                  className="cursor-pointer dark:text-accent-dark hover:text-white h-full w-10 flex justify-center items-center"
                >
                  <RxCross2 className="duration-300 text-xl" />
                </span>
              </div>
              <div className="h-full dark:bg-teal-800 bg-teal-300 px-2 pb-2 flex flex-col">
                {tabs && tabs?.length > 0 ? (
                  <div className="flex gap-2 flex-col h-full">
                    <ModalTabContainer>
                      {tabs.map((tab) => (
                        <ModalTab
                          key={tab.label}
                          className={cn(
                            activeTab?.label === tab.label && 'bg-teal-600!',
                          )}
                          onClick={() => {
                            setActiveTab(tab);
                          }}
                        >
                          {tab.label}
                        </ModalTab>
                      ))}
                    </ModalTabContainer>
                    <div className="h-full flex gap-1 flex-col dark:bg-teal-800 bg-accent-dark overflow-scroll scrollbar rounded-sm">
                      <>
                        {seperatorText && <Seperator text={seperatorText} />}
                        {activeTabContent?.content}
                      </>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">{children}</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomModal;
