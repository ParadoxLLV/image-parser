import React from 'react'

type ModalRowProps = {
    children: React.ReactNode;
}

const ModalRow = ({children}: ModalRowProps) => {
  return (
    <div className="w-full p-2 h-10 bg-teal-600 flex items-center justify-between dark:text-white">
        {children}
    </div>
  )
}

export default ModalRow