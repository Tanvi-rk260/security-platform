'use client';
import KeywordForm from '@/components/KeywordForm/KeywordForm';
import KeywordReport from '@/components/KeywordReport/KeywordReport';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { useState } from 'react';

export default function KeywordPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleKeywordCheck = async (url) => {
    setLoading(true);
    const res = await fetch('/api/keyword-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setReport(data);
    setLoading(false);
  };

  return (
    <main>
    <Navbar/>
      <div className='bg-gray-200 p-6'>
      <h1 className="text-xl font-bold mb-4 mt-6">Keyword Density Checker</h1>
      <KeywordForm onSubmit={handleKeywordCheck}/>
      {loading && <p className="mt-4">Analyzing...</p>}
      {report && !loading && <KeywordReport data={report} />}
      </div>
      <Footer/>
    </main>
  );
}

