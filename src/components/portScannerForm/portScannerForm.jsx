'use client';
import { useState } from "react";
import { SearchIcon, Loader2, ShieldAlert, ServerIcon } from 'lucide-react';

const PortScannerForm = () => {
  const [host, setHost] = useState("");
  const [portRange, setPortRange] = useState("");
  const [error, setError] = useState("");
  const [scanResults, setScanResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateHost = (host) => {
    // Validate hostname or IP address
    const hostnamePattern = new RegExp(
      "^(([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}(:\\d+)?(\\/.*)?$",
      "i"
    );
    const ipPattern = new RegExp(
      "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
      "i"
    );
    return hostnamePattern.test(host) || ipPattern.test(host);
  };

  const validatePortRange = (range) => {
    // Accept either a single port (e.g., "80") or a range (e.g., "80-100")
    const singlePortPattern = /^\d{1,5}$/;
    const portRangePattern = /^\d{1,5}-\d{1,5}$/;
    const commonPortsPattern = /^common$/i;

    if (commonPortsPattern.test(range)) {
      return true;
    } else if (singlePortPattern.test(range)) {
      const port = parseInt(range, 10);
      return port > 0 && port < 65536;
    } else if (portRangePattern.test(range)) {
      const [start, end] = range.split('-').map(p => parseInt(p, 10));
      return start > 0 && end < 65536 && start < end;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate host
    if (!validateHost(host)) {
      setError("❌ Please enter a valid hostname or IP address.");
      return;
    }

    // Validate port range
    if (!validatePortRange(portRange)) {
      setError("❌ Please enter a valid port or port range (e.g., 80 or 80-100) or 'common'.");
      return;
    }

    setError("");
    setLoading(true);
    setScanResults(null);

    try {
      let apiUrl;
      
      // Handle "common" ports keyword
      if (/^common$/i.test(portRange)) {
        apiUrl = `/api/portScan?host=${encodeURIComponent(host)}`;
      } else {
        // Format the API call for specific port or range
        const [startPort, endPort] = portRange.includes('-') 
          ? portRange.split('-').map(p => parseInt(p, 10))
          : [parseInt(portRange, 10), parseInt(portRange, 10)];

        // Check if the port range is reasonable
        if (endPort - startPort > 100) {
          setError("⚠️ Please limit port scan range to 100 ports for performance reasons.");
          setLoading(false);
          return;
        }

        apiUrl = `/api/portScan?host=${encodeURIComponent(host)}&startPort=${startPort}&endPort=${endPort}`;
      }

      // Make the actual API call
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setScanResults(result);
      
    } catch (error) {
      console.error("Error:", error);
      setError(`⚠️ ${error.message || "Something went wrong. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 mb-5">
      <img src="verified.png" alt="verify" className="w-16 h-20 mb-4 mt-7" />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">Protect Your Network</h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mt-3">
        Identify open ports that could be potential security vulnerabilities on your network.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mt-10">
        <h1 className="text-2xl font-bold text-center mb-5 mt-4 text-green-800">
          <ServerIcon className="inline-block mr-2 h-6 w-6" />
          Open Port Scanner
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="hostInput" className="block text-sm font-medium text-gray-700 mb-1">
              Hostname or IP Address
            </label>
            <input
              type="text"
              id="hostInput"
              name="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="example.com or 192.168.1.1"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
          
          <div>
            <label htmlFor="portRangeInput" className="block text-sm font-medium text-gray-700 mb-1">
              Port or Port Range
            </label>
            <input
              type="text"
              id="portRangeInput"
              name="portRange"
              value={portRange}
              onChange={(e) => setPortRange(e.target.value)}
              placeholder="80 or 80-100 or 'common'"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a single port (e.g., 80), a range (e.g., 80-100), or 'common' to scan well-known ports. Maximum range: 100 ports.
            </p>
          </div>
          
          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
            {loading ? "Scanning..." : "Scan Ports"}
          </button>
        </form>

        {/* Results Area */}
        <div className="mt-6">
          {loading && (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-800 mb-3"></div>
              <p className="text-blue-800 font-medium">Scanning ports on {host}...</p>
            </div>
          )}

          {!loading && scanResults && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-blue-800 mb-2">Port Scan Results</h2>
              
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-500">Host</p>
                    <p className="font-medium">{scanResults.host}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-500">Scan Time</p>
                    <p className="font-medium">{new Date(scanResults.scanTime).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-500">Open Ports</p>
                    <p className="font-medium text-yellow-600">{scanResults.summary.open} of {scanResults.summary.total}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm text-gray-500">Risk Assessment</p>
                    <p className={`font-medium ${getRiskColor(scanResults.summary.riskAssessment)}`}>
                      {scanResults.summary.riskAssessment}
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="font-bold text-blue-800 mb-2">Port Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(scanResults.ports).map(([port, details]) => (
                      <tr key={port} className={details.open ? "bg-blue-50" : ""}>
                        <td className="px-4 py-2 whitespace-nowrap">{port}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${details.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {details.open ? 'Open' : 'Closed'}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{details.service}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`font-medium ${getRiskColor(details.risk)}`}>
                            {details.risk}
                          </span>
                        </td>
                        <td className="px-4 py-2">{details.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {scanResults.recommendations && scanResults.recommendations.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-1 flex items-center">
                    <ShieldAlert className="inline-block mr-1 h-5 w-5" />
                    Security Recommendations
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {scanResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setScanResults(null)}
                  className="text-blue-800 hover:underline font-medium"
                >
                  Run Another Scan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortScannerForm;