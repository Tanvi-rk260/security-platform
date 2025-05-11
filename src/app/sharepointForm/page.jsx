import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import SharePointScanner from '@/components/sharepointForm/sharepointForm'
import React from 'react'

export default function Page() {
  return (
    <div>
     <Navbar/>
     <SharePointScanner/>
     <Footer/>
     
    </div>
  )
}


