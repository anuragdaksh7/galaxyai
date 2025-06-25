import React from 'react'

const Layout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
      {children}
    </div>
  )
}

export default Layout