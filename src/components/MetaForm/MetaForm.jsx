// MetaForm.jsx
'use client';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import MetaReport from '../MetaReport/MetaReport';


export default function MetaForm({ onSubmit, meta, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onSubmit(url);
  };

  return (
    <div className="flex flex-col items-center  bg-gray-100 mb-10">
      <img src="verify.png" alt="verify" className="w-16 h-20 mb-4 mt-2" />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 ">Protect Your Website</h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mt-3">
        Our advanced security scanner identifies vulnerabilities before attackers can exploit them.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-5  text-green-800">
          Meta Tag Analyzer
        </h1>

        <form onSubmit={handleSubmit} className="space-x-2">
          <input
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
          />
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <SearchIcon className="h-5 w-5" />
            Analyze
          </button>
        </form>

        {/* Meta Report */}
        {loading ? (
          <p className="mt-6 text-center text-gray-600">Analyzing...</p>
        ) : (
          <MetaReport meta={meta}/>
        )}
      </div>
    </div>
  );
}
//<MetaReport meta={meta} />