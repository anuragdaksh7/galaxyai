import Navbar from '@/ui/Navbar';
import Sidebar from '@/ui/Sidebar';
import React from 'react'

type Props = {}

const Layout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col items-center" style={{
        height: "100vh",
      }}>
        <Navbar />
        {children}
      </div>
    </>
  )
}

export default Layout