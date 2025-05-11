import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import SecurityChecker from '@/components/securityChecker/securityChecker'
import React from 'react'

export default function Page() {
  return (
    <div>
      <Navbar/>
      <SecurityChecker/>
      <Footer/>
    </div>
  )
}

