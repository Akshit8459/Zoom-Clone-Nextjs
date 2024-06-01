import { SignUp } from '@clerk/nextjs'
import React from 'react'

const RegistrationPage = () => {
  return (
    <main className='flex items-center justify-center w-full h-screen'>
        <SignUp/>
    </main>
  )
}

export default RegistrationPage