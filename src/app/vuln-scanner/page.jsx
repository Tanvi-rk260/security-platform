import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import Vulnscanner from '@/components/vuln-scanner/vuln-scanner'
import React from 'react'

export default function Page() {
  return (
    <div>
    <Navbar/>
      <Vulnscanner/>
      <Footer/>
    </div>
  )
}
