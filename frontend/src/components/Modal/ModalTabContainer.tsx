import React from 'react'

type ModalTabContainerProps = {
  children: React.ReactNode;
}

const ModalTabContainer = ({children}: ModalTabContainerProps) => {
  return (
    <div className='flex w-full h-10 gap-2 mt-2'>
      {children}
    </div>
  )
}

export default ModalTabContainer