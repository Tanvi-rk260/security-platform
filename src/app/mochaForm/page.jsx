import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'
import MochaTestPage from '@/components/mochaForm/mochaForm'

import React from 'react'
export const metadata = {
    title: 'Mocha API Testing Tool',
    description: 'Test your API endpoints with Mocha and verify responses with a simple interface.',
  };
export default function Page() {
  return (
    <div>
      <Navbar/>
      <MochaTestPage/>
      <Footer/>
    </div>
  )
}

