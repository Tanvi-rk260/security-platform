'use client';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import SpeedForm from '@/components/SpeedForm/SpeedForm';
import SpeedReport from '@/components/SpeedReport/SpeedReport';
import { useState } from 'react';

export default function PageSpeed() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSpeedTest = async (url) => {
    setLoading(true);
    const res = await fetch('/api/speed-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setReport(data);
    setLoading(false);
  };

  return (
    <main className="p-6">
  <Navbar />
  <SpeedForm onTest={handleSpeedTest} loading={loading} data={report} />
  <Footer />
</main>

  );
}
