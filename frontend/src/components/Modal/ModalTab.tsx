import React from 'react'
import { cn } from '../../helpers/utils/cn';

type ModalTabProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
}

const ModalTab = ({children, className, ...props}: ModalTabProps) => {
  return (
    <div {...props} className={cn('dark:bg-teal-700 rounded-sm bg-accent-dark p-2 flex-1 cursor-pointer hover:opacity-80 transition duration-300', className)}>
        <span className='text-center block'>{children}</span>
    </div>
  )
}

export default ModalTab