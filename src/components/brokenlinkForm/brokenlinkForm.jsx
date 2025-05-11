'use client'
import { useState } from "react";
import { Search, Loader2, LinkIcon } from 'lucide-react';

const BrokenlinkForm = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateUrl = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?(([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}(:\\d+)?(\\/.*)?$",
      "i"
    );
    return !!urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      setError("Please enter a valid website URL.");
      return;
    }

    setError("");
    setLoading(true); // Show loading indicator
    setLinkData(null); // Clear previous results

    try {
      const response = await fetch("/api/brokenlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.error) {
        setError("Failed to check links.");
        setLoading(false);
        return;
      }

      setLinkData(result); // Update state with the fetched link data
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 mb-5">
      <img src="seo.png" alt="link checker" className="w-40 h-20 mb-4 mt-7" />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">Improve User Experience</h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mt-3">
        Identify and fix broken links to enhance user experience and improve your SEO ranking.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mt-10">
        <h1 className="text-2xl font-bold text-center mb-5 mt-4 text-blue-800">
          Website Broken Link Checker
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LinkIcon className="h-5 w-5" />
            )}
            {loading ? "Scanning..." : "Scan Links"}
          </button>
        </form>

        {/* Results area - contains either loading indicator or link data */}
        <div className="mt-6">
          {loading && (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-800 border-opacity-50 mb-3"></div>
              <p className="text-blue-800 font-medium">Checking for broken links...</p>
            </div>
          )}

          {!loading && linkData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-blue-800 mb-2">Link Report</h2>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <strong>Summary:</strong>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded">
                    Total Links: {linkData.totalLinks || 0}
                  </span> 
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600" 
                    style={{ width: `${100 - (linkData.brokenLinks?.length / linkData.totalLinks * 100) || 100}%` }}>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-green-600">Working: {(linkData.totalLinks - (linkData.brokenLinks?.length || 0)) || 0}</span>
                  <span className="text-red-600">Broken: {linkData.brokenLinks?.length || 0}</span>
                </div>
              </div>
              
              {linkData.brokenLinks && linkData.brokenLinks.length > 0 ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-red-600">Broken Links:</h3>
                  <ul className="max-h-60 overflow-y-auto">
                    {linkData.brokenLinks.map((link, index) => (
                      <li key={index} className="mb-2 pb-2 border-b border-gray-200 last:border-0">
                        <div className="text-red-600 break-all">{link.url}</div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Error:</span> {link.error || "Not found"}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Found on:</span> {link.foundOn || "Homepage"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-green-600 font-medium">No broken links found! Your website links are all working properly.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokenlinkForm;
