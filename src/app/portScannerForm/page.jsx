import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import PortScannerForm from '@/components/portScannerForm/portScannerForm'
import React from 'react'

export default function Page() {
  return (
    <div>
      <Navbar/>
      <PortScannerForm/>
      <Footer/>
    </div>
  )
}


