import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import WordPressScanner from '@/components/wordpressForm/wordpressForm'
import React from 'react'

export default function Page() {
  return (
    <div>
    <Navbar/>
    <WordPressScanner/>
    <Footer/>
    </div>
  )
}


