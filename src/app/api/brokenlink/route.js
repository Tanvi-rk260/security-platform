

const axios = require("axios");
const cheerio = require("cheerio");

// Function to fetch webpage and extract links
const extractLinks = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const links = [];
        const linkMap = new Map(); // To track which page each link was found on

        $("a").each((_, element) => {
            const link = $(element).attr("href");
            if (link && link.startsWith("http")) {
                links.push(link);
                linkMap.set(link, url); // Store the current page URL as the source
            }
        });

        return { links, linkMap };
    } catch (error) {
        console.error("Error fetching page:", error.message);
        return { links: [], linkMap: new Map() };
    }
};

// Function to check if links are broken
const checkLinks = async (links, linkMap) => {
    const results = await Promise.all(
        links.map(async (link) => {
            try {
                const response = await axios.get(link, {
                    timeout: 5000, // 5 second timeout
                    validateStatus: false, // Don't throw on error status codes
                });
                return { 
                    url: link,
                    status: response.status,
                    working: response.status >= 200 && response.status < 400,
                    foundOn: linkMap.get(link)
                };
            } catch (error) {
                return { 
                    url: link,
                    status: error.response ? error.response.status : "Network Error",
                    error: error.message,
                    working: false,
                    foundOn: linkMap.get(link)
                };
            }
        })
    );

    return results;
};

// Next.js API route handler for App Router (Next.js 13+)
export async function POST(request) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return new Response(
                JSON.stringify({ error: "URL is required" }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Extract all links from the webpage
        const { links, linkMap } = await extractLinks(url);
        
        // Check if links are broken
        const checkedLinks = await checkLinks(links, linkMap);
        
        // Filter broken links (status codes >= 400 or errors)
        const brokenLinks = checkedLinks.filter(link => !link.working);

        return new Response(
            JSON.stringify({
                url: url,
                totalLinks: links.length,
                brokenLinks: brokenLinks.map(link => ({
                    url: link.url,
                    status: link.status,
                    error: link.error || `Status Code: ${link.status}`,
                    foundOn: link.foundOn || url
                }))
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({ error: "Failed to check links" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// For Pages Router (Next.js 12 and below)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        // Extract all links from the webpage
        const { links, linkMap } = await extractLinks(url);
        
        // Check if links are broken
        const checkedLinks = await checkLinks(links, linkMap);
        
        // Filter broken links (status codes >= 400 or errors)
        const brokenLinks = checkedLinks.filter(link => !link.working);

        return res.status(200).json({
            url: url,
            totalLinks: links.length,
            brokenLinks: brokenLinks.map(link => ({
                url: link.url,
                status: link.status,
                error: link.error || `Status Code: ${link.status}`,
                foundOn: link.foundOn || url
            }))
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Failed to check links" });
    }
}