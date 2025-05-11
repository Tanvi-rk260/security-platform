import Apiform from '@/components/api_form/apiform'
import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import React from 'react'

export default function Page() {
  return (
    <div>
    <Navbar/>
    <Apiform/>
    <Footer/>  
    </div>
  )
}
