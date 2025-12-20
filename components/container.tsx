import React from 'react'

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='flex-1 min-h-0 mx-auto px-3 w-full flex flex-row items-center justify-center'>
      {children}
    </section>
  )
}

export default Container

