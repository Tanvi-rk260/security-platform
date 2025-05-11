import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import ZapForm from '@/components/zapForm/zapForm'
import React from 'react'

export default function Page() {
  return (
    <div>
      <Navbar/>
      <ZapForm/>
      <Footer/>
    </div>
  )
}

