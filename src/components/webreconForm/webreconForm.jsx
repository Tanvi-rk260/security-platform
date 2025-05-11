'use client'
import { useState } from "react";
import { Loader2, Scan, AlertTriangle, CheckCircle, Info, ArrowUpRight, Shield, Code, Cloud, Lock, FileCode, Server, Database } from 'lucide-react';

const WebsiteRecon = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [reconData, setReconData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("technologies");

  const validateUrl = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?(([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}(:\\d+)?(\\/.*)?$",
      "i"
    );
    return !!urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate URL
    if (!validateUrl(url)) {
      setError("Please enter a valid website URL.");
      return;
    }

    // Clear previous states
    setError("");
    setLoading(true);
    setReconData(null);

    try {
      // Prepare URL for API call - ensure it has https:// prefix
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Make actual API call to a technology detection service
      // (Replace with your actual API endpoint)
      const response = await fetch('/api/website-recon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan website');
      }

      const data = await response.json();
      
      // Process and categorize the detected technologies
      const processedData = processDetectedTechnologies(data);
      setReconData(processedData);
    } catch (err) {
      console.error('Error scanning website:', err);
      setError(`Error scanning website: ${err.message}`);
      
      // For development/demo purposes only - remove in production
      // This simulates a successful API response with more realistic data
      if (process.env.NODE_ENV === 'development') {
        const demoData = generateDemoData(url);
        setReconData(demoData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Process detected technologies from API response
  const processDetectedTechnologies = (apiData) => {
    // This would process actual API data
    // For this example, we'll return the data as is
    return apiData;
  };

  // ONLY FOR DEVELOPMENT: Generate domain-specific mock data
  // In production, this would be replaced by actual API data
  const generateDemoData = (inputUrl) => {
    // Extract domain from URL for demo purposes
    let domain = inputUrl.replace(/^https?:\/\//, '').split('/')[0];
    
    // Map of common technology stacks by domain type
    const techStacks = {
      // E-commerce sites
      'shopify': {
        name: 'E-commerce (Shopify)',
        tech: [
          { name: "Shopify", version: "2.0", category: "CMS", type: "E-commerce Platform", risk: "Low" },
          { name: "Liquid", version: null, category: "Programming Languages", type: "Templating Language", risk: "Low" },
          { name: "jQuery", version: "3.6.0", category: "Libraries", type: "JavaScript Library", risk: "Low" },
          { name: "Ruby on Rails", version: null, category: "Frameworks", type: "Web Framework", risk: "Low" },
          { name: "Cloudflare", version: null, category: "CDN", type: "Content Delivery Network", risk: "Low" },
        ]
      },
      'magento': {
        name: 'E-commerce (Magento)',
        tech: [
          { name: "Magento", version: "2.4.3", category: "CMS", type: "E-commerce Platform", risk: "Medium" },
          { name: "PHP", version: "7.4.1", category: "Programming Languages", type: "Server-side Language", risk: "Medium" },
          { name: "MySQL", version: "5.7", category: "Databases", type: "Relational Database", risk: "Medium" },
          { name: "jQuery", version: "1.12.4", category: "Libraries", type: "JavaScript Library", risk: "High" },
          { name: "Apache", version: "2.4.48", category: "Servers", type: "Web Server", risk: "Medium" },
        ]
      },
      
      // WordPress sites
      'wordpress': {
        name: 'CMS (WordPress)',
        tech: [
          { name: "WordPress", version: "5.9.3", category: "CMS", type: "Content Management System", risk: "High" },
          { name: "PHP", version: "7.4.28", category: "Programming Languages", type: "Server-side Language", risk: "Medium" },
          { name: "MySQL", version: "5.7", category: "Databases", type: "Relational Database", risk: "Medium" },
          { name: "jQuery", version: "3.5.1", category: "Libraries", type: "JavaScript Library", risk: "Medium" },
          { name: "Yoast SEO", version: "18.2", category: "WordPress Plugins", type: "SEO Plugin", risk: "Low" },
          { name: "Apache", version: "2.4.52", category: "Servers", type: "Web Server", risk: "High" },
        ]
      },
      
      // Modern web app
      'react': {
        name: 'Modern Web App (React)',
        tech: [
          { name: "React", version: "18.2.0", category: "Frameworks", type: "JavaScript Framework", risk: "Low" },
          { name: "Next.js", version: "13.4.7", category: "Frameworks", type: "JavaScript Framework", risk: "Low" },
          { name: "Node.js", version: "16.14.0", category: "Programming Languages", type: "JavaScript Runtime", risk: "Medium" },
          { name: "AWS", version: null, category: "PaaS", type: "Cloud Platform", risk: "Low" },
          { name: "MongoDB", version: "5.0", category: "Databases", type: "NoSQL Database", risk: "Medium" },
          { name: "Tailwind CSS", version: "3.3.2", category: "Frameworks", type: "CSS Framework", risk: "Low" },
          { name: "Cloudflare", version: null, category: "CDN", type: "Content Delivery Network", risk: "Low" },
        ]
      },
      
      // Default case - generates varied data based on domain string
      'default': {
        name: 'Generic Website',
        tech: [
          { name: "jQuery", version: "3.6.0", category: "Libraries", type: "JavaScript Library", risk: "Low" },
          { name: "Bootstrap", version: "5.2.3", category: "Frameworks", type: "CSS Framework", risk: "Low" },
          { name: "Google Analytics", version: "GA4", category: "Analytics", type: "Web Analytics", risk: "Low" },
          { name: "Nginx", version: "1.22.1", category: "Servers", type: "Web Server", risk: "Low" },
          { name: "Let's Encrypt", version: null, category: "Certificate Authorities", type: "Free SSL Certificate Provider", risk: "Low" },
        ]
      }
    };
    
    // Determine which technology stack to use based on URL
    let stackKey = 'default';
    
    if (domain.includes('shopify') || domain.includes('myshopify')) {
      stackKey = 'shopify';
    } else if (domain.includes('magento') || domain.includes('magentosite')) {
      stackKey = 'magento';
    } else if (domain.includes('wp') || domain.includes('wordpress')) {
      stackKey = 'wordpress';
    } else if (Math.random() > 0.6) { // Randomly select some URLs as React sites
      stackKey = 'react';
    }
    
    // Get selected tech stack
    const selectedStack = techStacks[stackKey];
    
    // Add some randomness to versions and include domain in the results
    const technologies = selectedStack.tech.map(tech => ({
      ...tech,
      version: tech.version ? (Math.random() > 0.7 ? tech.version : incrementVersion(tech.version)) : null
    }));
    
    // Generate recommendations based on detected technologies
    const recommendations = generateRecommendations(technologies);
    
    // Calculate summary statistics
    const summary = calculateSummary(technologies);
    
    // Final data structure
    return {
      technologies,
      recommendations,
      coverage: {
        pagesScanned: Math.floor(Math.random() * 15) + 5,
        resourcesAnalyzed: Math.floor(Math.random() * 50) + 20,
        scanDepth: Math.random() > 0.5 ? "Medium" : "High",
        scanDate: new Date().toISOString().split('T')[0],
        coverageScore: Math.floor(Math.random() * 30) + 70,
        frameworks: true,
        paas: stackKey === 'react',
        certificate_authorities: true,
        cdn: ['shopify', 'react'].includes(stackKey),
        font_scripts: Math.random() > 0.5,
        libraries: true,
        programming_languages: true,
        servers: true,
        security: Math.random() > 0.3
      },
      summary
    };
  };
  
  // Helper function to increment version numbers for variety
  const incrementVersion = (version) => {
    const parts = version.split('.');
    if (parts.length > 0) {
      const lastPart = parseInt(parts[parts.length - 1]);
      if (!isNaN(lastPart)) {
        parts[parts.length - 1] = (lastPart + Math.floor(Math.random() * 3)).toString();
      }
    }
    return parts.join('.');
  };
  
  // Generate realistic recommendations based on technologies
  const generateRecommendations = (technologies) => {
    const recommendations = [];
    
    // Check for outdated or risky technologies
    technologies.forEach(tech => {
      if (tech.risk === 'High') {
        recommendations.push(`Update ${tech.name} from version ${tech.version || 'unknown'} to the latest version to address known security vulnerabilities.`);
      } else if (tech.risk === 'Medium' && Math.random() > 0.3) {
        recommendations.push(`Consider updating ${tech.name} to improve security posture.`);
      }
    });
    
    // Add some general recommendations
    if (Math.random() > 0.5) {
      recommendations.push("Implement Content Security Policy (CSP) headers to prevent XSS attacks.");
    }
    
    if (Math.random() > 0.6) {
      recommendations.push("Remove server information disclosure from HTTP headers.");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("No critical security issues found. Consider regular security audits to maintain your security posture.");
    }
    
    return recommendations;
  };
  
  // Calculate summary statistics from detected technologies
  const calculateSummary = (technologies) => {
    // Count technologies by category
    const categoryCounts = {};
    const riskCounts = { high: 0, medium: 0, low: 0 };
    
    technologies.forEach(tech => {
      // Count by category
      const categoryKey = tech.category.toLowerCase().replace(/\s+/g, '') + 'Count';
      categoryCounts[categoryKey] = (categoryCounts[categoryKey] || 0) + 1;
      
      // Count by risk level
      if (tech.risk.toLowerCase() === 'high') {
        riskCounts.high++;
      } else if (tech.risk.toLowerCase() === 'medium') {
        riskCounts.medium++;
      } else {
        riskCounts.low++;
      }
    });
    
    return {
      ...categoryCounts,
      highRiskCount: riskCounts.high,
      mediumRiskCount: riskCounts.medium,
      lowRiskCount: riskCounts.low
    };
  };

  // Helper function to display risk level with appropriate color and icon
  const renderRiskLevel = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return (
          <span className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center text-yellow-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Low
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-600">
            <Info className="h-4 w-4 mr-1" />
            {risk}
          </span>
        );
    }
  };

  // Group technologies by category
  const groupTechnologiesByCategory = (technologies) => {
    if (!technologies) return {};
    
    const groups = {};
    technologies.forEach(tech => {
      if (!groups[tech.category]) {
        groups[tech.category] = [];
      }
      groups[tech.category].push(tech);
    });
    
    return groups;
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'frameworks':
        return <Code className="h-5 w-5 mr-2" />;
      case 'paas':
      case 'platform as a service':
        return <Cloud className="h-5 w-5 mr-2" />;
      case 'certificate authorities':
      case 'ssl/tls':
        return <Lock className="h-5 w-5 mr-2" />;
      case 'cdn':
      case 'content delivery network':
        return <ArrowUpRight className="h-5 w-5 mr-2" />;
      case 'font scripts':
        return <FileCode className="h-5 w-5 mr-2" />;
      case 'libraries':
        return <FileCode className="h-5 w-5 mr-2" />;
      case 'programming languages':
        return <Code className="h-5 w-5 mr-2" />;
      case 'servers':
        return <Server className="h-5 w-5 mr-2" />;
      case 'databases':
        return <Database className="h-5 w-5 mr-2" />;
      case 'security':
        return <Shield className="h-5 w-5 mr-2" />;
      case 'cms':
        return <FileCode className="h-5 w-5 mr-2" />;
      case 'wordpress plugins':
        return <FileCode className="h-5 w-5 mr-2" />;
      case 'analytics':
        return <Info className="h-5 w-5 mr-2" />;
      default:
        return <Info className="h-5 w-5 mr-2" />;
    }
  };

  // Render summary cards
  const renderSummaryCards = () => {
    if (!reconData || !reconData.summary) return null;
    
    // Define all possible categories
    const allCategories = [
      { name: "Frameworks", count: reconData.summary.frameworksCount || 0, icon: <Code className="h-6 w-6" /> },
      { name: "Programming Languages", count: reconData.summary.programminglanguagesCount || 0, icon: <Code className="h-6 w-6" /> },
      { name: "Libraries", count: reconData.summary.librariesCount || 0, icon: <FileCode className="h-6 w-6" /> },
      { name: "PaaS", count: reconData.summary.paasCount || 0, icon: <Cloud className="h-6 w-6" /> },
      { name: "CDN", count: reconData.summary.cdnCount || 0, icon: <ArrowUpRight className="h-6 w-6" /> },
      { name: "CMS", count: reconData.summary.cmsCount || 0, icon: <FileCode className="h-6 w-6" /> },
      { name: "Databases", count: reconData.summary.databasesCount || 0, icon: <Database className="h-6 w-6" /> },
      { name: "Servers", count: reconData.summary.serversCount || 0, icon: <Server className="h-6 w-6" /> }
    ];
    
    // Filter out categories with zero count
    const categoriesToShow = allCategories.filter(cat => cat.count > 0);
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categoriesToShow.map((cat, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
            <div className="p-2 rounded-full bg-green-100 mb-2">
              {cat.icon}
            </div>
            <p className="text-xl font-bold text-green-800">{cat.count}</p>
            <p className="text-sm text-gray-600 text-center">{cat.name}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 mb-5">
      {/* Header */}
      <img src="/web-recon.png" alt="reconnaissance" className="w-30 h-20 mb-4 mt-7" />
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">Website Reconnaissance</h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto text-center mt-3">
        Discover what technologies and software your website reveals to potential attackers and assess the associated risks.
      </p>
  
      {/* Scanner Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mt-10">
        <h1 className="text-2xl font-bold text-center mb-5 mt-4 text-green-800">
          Website Technology Scanner
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
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Scan className="h-5 w-5" />
            )}
            {loading ? "Scanning..." : "Scan Website"}
          </button>
        </form>
  
        {/* Results area */}
        <div className="mt-6">
          {loading && (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-800 border-opacity-50 mb-3"></div>
              <p className="text-green-800 font-medium">Scanning website technologies...</p>
            </div>
          )}
  
          {!loading && reconData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Reconnaissance Report for {url}
              </h2>
  
              {/* Summary Cards */}
              {renderSummaryCards()}
  
              {/* Security Overview */}
              <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Security Overview</h3>
                <div className="flex items-center space-x-6">
                  {/* High Risk */}
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-red-600">{reconData.summary?.highRiskCount?? 0}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-1">High Risk</p>
                  </div>
                  {/* Medium Risk */}
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-yellow-600">{reconData.summary?.mediumRiskCount?? 0}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-1">Medium Risk</p>
                  </div>
                  {/* Low Risk */}
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">{reconData.summary?.lowRiskCount?? 0}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mt-1">Low Risk</p>
                  </div>
                </div>
              </div>
  
              {/* Tabs */}
              <div className="mb-4 border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px">
                  <button 
                    onClick={() => setActiveTab("technologies")}
                    className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
                      activeTab === "technologies"
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    All Technologies
                  </button>
                  <button 
                    onClick={() => setActiveTab("categories")}
                    className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
                      activeTab === "categories"
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    By Category
                  </button>
                  <button 
                    onClick={() => setActiveTab("recommendations")}
                    className={`mr-4 py-2 px-1 font-medium text-sm border-b-2 ${
                      activeTab === "recommendations"
                        ? "border-green-600 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Recommendations
                  </button>
                </nav>
              </div>
  
              {/* All Technologies Tab */}
              {activeTab === "technologies" && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-2">Detected Technologies</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-4 border-b text-left">Software</th>
                          <th className="py-2 px-4 border-b text-left">Version</th>
                          <th className="py-2 px-4 border-b text-left">Category</th>
                          <th className="py-2 px-4 border-b text-left">Type</th>
                          <th className="py-2 px-4 border-b text-left">Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reconData.technologies.map((tech, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-2 px-4 border-b">{tech.name}</td>
                            <td className="py-2 px-4 border-b">{tech.version || "Unknown"}</td>
                            <td className="py-2 px-4 border-b">{tech.category}</td>
                            <td className="py-2 px-4 border-b">{tech.type}</td>
                            <td className="py-2 px-4 border-b">{renderRiskLevel(tech.risk)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
  
              {/* Categories Tab */}
              {activeTab === "categories" && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-3">Technologies by Category</h3>
                  {Object.entries(groupTechnologiesByCategory(reconData.technologies)).map(([category, techs]) => (
                    <div key={category} className="mb-4">
                      <div className="flex items-center bg-green-100 p-2 rounded-t-md border border-green-200">
                        {getCategoryIcon(category)}
                        <h4 className="font-semibold text-green-800">{category}</h4>
                      </div>
                      <div className="overflow-x-auto border-x border-b border-gray-200 rounded-b-md">
                        <table className="min-w-full bg-white">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-2 px-4 border-b text-left text-sm">Software</th>
                              <th className="py-2 px-4 border-b text-left text-sm">Version</th>
                              <th className="py-2 px-4 border-b text-left text-sm">Type</th>
                              <th className="py-2 px-4 border-b text-left text-sm">Risk</th>
                            </tr>
                          </thead>
                          <tbody>
                            {techs.map((tech, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="py-2 px-4 border-b">{tech.name}</td>
                                <td className="py-2 px-4 border-b">{tech.version || "Unknown"}</td>
                                <td className="py-2 px-4 border-b">{tech.type}</td>
                                <td className="py-2 px-4 border-b">{renderRiskLevel(tech.risk)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
  
              {/* Recommendations Tab */}
              {activeTab === "recommendations" && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-2 bg-white p-4 rounded-md border border-gray-200">
                    {reconData.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
  
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}  
export default WebsiteRecon;