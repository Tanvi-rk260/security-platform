import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import ResultsPage from '@/components/resultspage/ResultsPage'
import React from 'react'

export default function Page() {
  return (
    <div>
      <Navbar/>
      <ResultsPage/>
      <Footer/>
    </div>
  )
}

