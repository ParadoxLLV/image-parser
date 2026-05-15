import React from 'react'
import { cn } from '../helpers/utils/cn';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container = ({children, className}: ContainerProps) => {
  return (
    <div className={`${cn(className, `px-4 lg:px-6 dark:bg-background-dark bg-background flex flex-col`)}`}>
        {children}
    </div>
  )
}

export default Container