'use client';
import { useState } from "react";
import { SearchIcon, Loader2 } from 'lucide-react';

const Wafform = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [wafData, setWafData] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateUrl = (url) => {
    // Enhanced URL validation - handles URLs with or without protocol
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?(([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}(:\\d+)?(\\/.*)?$",
      "i"
    );
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure URL has protocol
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (!validateUrl(formattedUrl)) {
      setError("❌ Please enter a valid website URL.");
      return;
    }

    setError("");
    setLoading(true);
    setWafData(null);

    try {
      // Changed to use the GET method with URL parameter to match your API
      const apiUrl = `/api/WAF?url=${encodeURIComponent(formattedUrl)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Safely handle JSON parsing
      let result;
      try {
        const textData = await response.text();
        result = textData ? JSON.parse(textData) : {};
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response format");
      }

      if (result.error) {
        setError(`⚠️ ${result.error}`);
        return;
      }

      // Process the WAF data to match the expected format
      const processedData = {
        wafDetected: Array.isArray(result.waf) 
          ? result.waf.length > 0 
          : result.waf !== "No WAF detected",
        provider: Array.isArray(result.waf) 
          ? result.waf.join(", ") 
          : result.waf,
        protectionLevel: result.ruleAnalysis?.protectionLevel || determineProtectionLevel(result),
        attackPrevention: result.ruleAnalysis?.activeRules?.length > 0 || determineAttackPrevention(result),
        rawHeaders: result.headers || {},
        ruleAnalysis: result.ruleAnalysis || null
      };

      setWafData(processedData);
    } catch (error) {
      console.error("Error:", error);
      setError(`⚠️ ${error.message || "Something went wrong. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine protection level based on WAF response
  const determineProtectionLevel = (wafResult) => {
    if (!wafResult.waf || wafResult.waf === "No WAF detected") {
      return "None";
    }
    
    const providers = Array.isArray(wafResult.waf) ? wafResult.waf : [wafResult.waf];
    
    // Enterprise-level WAFs typically provide stronger protection
    const enterpriseWafs = ["Cloudflare Enterprise", "Akamai", "F5 BIG-IP", "Imperva"];
    if (providers.some(p => enterpriseWafs.some(ew => p.includes(ew)))) {
      return "High";
    }
    
    return "Medium";
  };

  // Helper function to determine attack prevention capability
  const determineAttackPrevention = (wafResult) => {
    if (!wafResult.waf || wafResult.waf === "No WAF detected") {
      return false;
    }
    
    // Any detected WAF likely has some attack prevention capabilities
    return true;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 mb-5">
      <img src="verify.png" alt="verify" className="w-16 h-20 mb-4 mt-7" />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">Protect Your Website</h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mt-3">
        Our advanced security scanner identifies vulnerabilities before attackers can exploit them.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mt-10">
        <h1 className="text-2xl font-bold text-center mb-5 mt-4 text-green-800">
          Web Application Firewall (WAF) Scanner
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
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-800"
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
            {loading ? "Scanning..." : "Scan"}
          </button>
        </form>

        {/* Results Area */}
        <div className="mt-6">
          {loading && (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-800 mb-3"></div>
              <p className="text-green-800 font-medium">Checking for WAF...</p>
            </div>
          )}

          {!loading && wafData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-green-800 mb-2">WAF Report</h2>
              <ul>
                <li className="mb-2">
                  <strong>WAF Status: </strong>
                  <span className={wafData.wafDetected ? "text-green-600" : "text-red-600"}>
                    {wafData.wafDetected ? wafData.provider : "No WAF detected"}
                  </span>
                </li>
                <li className="mb-2">
                  <strong>Firewall Protection Level: </strong>
                  <span className={
                    wafData.protectionLevel === "High" ? "text-green-600" : 
                    wafData.protectionLevel === "Medium" ? "text-yellow-600" : 
                    "text-red-600"
                  }>
                    {wafData.protectionLevel}
                  </span>
                </li>
                <li className="mb-2">
                  <strong>Attack Prevention: </strong>
                  {wafData.attackPrevention ? "✅ Enabled" : "❌ Not Enforced"}
                </li>
                <li className="mb-2">
                  <strong>Risk Level: </strong>
                  <span className={
                    wafData.ruleAnalysis?.riskLevel === "Low" ? "text-green-600" : 
                    wafData.ruleAnalysis?.riskLevel === "Medium" ? "text-yellow-600" : 
                    "text-red-600"
                  }>
                    {wafData.ruleAnalysis?.riskLevel || "High"}
                  </span>
                </li>
              </ul>
              
              {/* WAF Rule Analysis */}
              {wafData.ruleAnalysis && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-bold text-green-800 mb-2">WAF Rule Analysis</h3>
                  
                  {wafData.ruleAnalysis.activeRules && wafData.ruleAnalysis.activeRules.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold">Active Rules Detected:</h4>
                      <ul className="list-disc pl-5 mt-1">
                        {wafData.ruleAnalysis.activeRules.map((rule, index) => (
                          <li key={index} className="text-sm text-gray-700">{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {wafData.ruleAnalysis.recommendations && wafData.ruleAnalysis.recommendations.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-semibold">Recommendations:</h4>
                      <ul className="list-disc pl-5 mt-1">
                        {wafData.ruleAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Show header details in collapsible section */}
              {wafData.rawHeaders && Object.keys(wafData.rawHeaders).length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-green-800 font-medium">
                    View Technical Details
                  </summary>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-60">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(wafData.rawHeaders, null, 2)}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wafform;