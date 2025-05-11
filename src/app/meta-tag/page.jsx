'use client';

import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import MetaForm from '@/components/MetaForm/MetaForm';
import MetaReport from '@/components/MetaReport/MetaReport';
import { useState } from 'react';

export default function AnalyzePage() {
  const [metaTags, setMetaTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (url) => {
    setLoading(true);
    const res = await fetch('/api/meta-analyze', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setMetaTags(data.meta || []);
    setLoading(false);
  };

  return (
    <main className="p-1">
    <Navbar />
    <MetaForm onSubmit={handleAnalyze} meta={metaTags} loading={loading} />
    <Footer />
  </main>
  
  );
}

//<MetaForm onSubmit={handleAnalyze}/>