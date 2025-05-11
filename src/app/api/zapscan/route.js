// File: pages/api/zapscan.js
export default async function handler(req, res) {
    // Add CORS headers if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request (for CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Configuration - Update this if needed
    const ZAP_API_URL = "http://127.0.0.1:8080"; // ZAP API base URL
    const ZAP_API_KEY = "";                      // Leave empty if API key is disabled

    if (req.method === "POST") {
        console.log("Received POST request to start scan");
        
        try {
            const { url } = req.body;
            
            if (!url) {
                console.error("Missing URL in request body");
                return res.status(400).json({ message: "URL is required" });
            }

            console.log("Processing URL:", url);
            
            // STEP 1: First, spider the site to add it to the ZAP tree
            console.log("Starting spider scan to add URL to the ZAP tree...");
            const spiderUrl = `${ZAP_API_URL}/JSON/spider/action/scan/?url=${encodeURIComponent(url)}`;
            console.log("Spider URL:", spiderUrl);
            
            const spiderResponse = await fetch(spiderUrl);
            
            if (!spiderResponse.ok) {
                const errorText = await spiderResponse.text();
                console.error("ZAP Spider API error:", errorText);
                return res.status(500).json({ 
                    message: "ZAP Spider API returned an error", 
                    error: errorText 
                });
            }
            
            const spiderData = await spiderResponse.json();
            console.log("Spider scan started:", spiderData);
            
            // Wait for spider to complete (simple delay, in production use polling)
            console.log("Waiting for spider to complete...");
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            // STEP 2: Now start the active scan
            console.log("Starting active scan for URL:", url);
            const scanUrl = `${ZAP_API_URL}/JSON/ascan/action/scan/?url=${encodeURIComponent(url)}`;
            console.log("Active scan URL:", scanUrl);
            
            const scanResponse = await fetch(scanUrl);
            
            if (!scanResponse.ok) {
                const errorText = await scanResponse.text();
                console.error("ZAP Active Scan API error:", errorText);
                return res.status(500).json({ 
                    message: "ZAP Active Scan API returned an error", 
                    error: errorText 
                });
            }
            
            const scanData = await scanResponse.json();
            console.log("Active scan started:", scanData);

            return res.status(200).json({ 
                message: "Scan process started successfully", 
                spiderId: spiderData.scan || "unknown",
                scanId: scanData.scan || "unknown"
            });
        } catch (error) {
            console.error("Error starting scan:", error);
            return res.status(500).json({ 
                message: "Error starting scan", 
                error: error.message 
            });
        }
    }

    if (req.method === "GET") {
        console.log("Received GET request for scan results");
        
        try {
            // Construct the ZAP API URL for alerts
            const apiUrl = `${ZAP_API_URL}/JSON/core/view/alerts/`;
            console.log("Fetching alerts from ZAP:", apiUrl);
            
            // Make request to ZAP
            const zapResponse = await fetch(apiUrl);
            
            // Check ZAP response
            if (!zapResponse.ok) {
                const errorText = await zapResponse.text();
                console.error("ZAP API error:", errorText, "Status:", zapResponse.status);
                return res.status(500).json({ 
                    message: "ZAP API returned an error", 
                    error: errorText,
                    status: zapResponse.status
                });
            }
            
            // Parse ZAP response
            const data = await zapResponse.json();
            console.log("ZAP results retrieved, alert count:", data.alerts ? data.alerts.length : 0);
            
            // Format the data to match what the frontend expects
            const formattedResults = (data.alerts || []).map(alert => ({
                name: alert.name || "Unknown Issue",
                url: alert.url || "N/A",
                risk: alert.risk || "Unknown",
                description: alert.description || "No description available"
            }));

            // Return formatted results
            return res.status(200).json({ 
                message: "Scan results retrieved", 
                results: formattedResults 
            });
        } catch (error) {
            console.error("Error fetching results:", error);
            return res.status(500).json({ 
                message: "Error fetching results", 
                error: error.message 
            });
        }
    }

    // If the request method is neither POST nor GET
    console.error(`Method ${req.method} not allowed`);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}