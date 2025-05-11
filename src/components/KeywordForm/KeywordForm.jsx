'use client';
import { useState } from 'react';

export default function KeywordForm({ onSubmit }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded mb-6">
        Analyze Keyword Density
      </button>
    </form>
  );
}
