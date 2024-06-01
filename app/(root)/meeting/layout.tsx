import Navbar from '@/components/Navbar'
import React, { ReactNode } from 'react'

const layout = ({children}:{children:ReactNode}) => {
  return (
    <main>
        <Navbar/>
        {children}
        FOOTER
    </main>
  )
}

export default layout