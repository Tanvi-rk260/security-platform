// File: /app/api/portScan/route.js
import { NextResponse } from 'next/server';
const net = require('net');

// Common port definitions for better reporting
const commonPorts = {
  20: { service: "FTP-Data", description: "File Transfer Protocol (data)", risk: "Medium" },
  21: { service: "FTP", description: "File Transfer Protocol (control)", risk: "Medium" },
  22: { service: "SSH", description: "Secure Shell", risk: "Low" },
  23: { service: "Telnet", description: "Unencrypted text communications", risk: "High" },
  25: { service: "SMTP", description: "Simple Mail Transfer Protocol", risk: "Medium" },
  53: { service: "DNS", description: "Domain Name System", risk: "Medium" },
  80: { service: "HTTP", description: "Hypertext Transfer Protocol", risk: "Medium" },
  110: { service: "POP3", description: "Post Office Protocol v3", risk: "Medium" },
  143: { service: "IMAP", description: "Internet Message Access Protocol", risk: "Medium" },
  443: { service: "HTTPS", description: "HTTP Secure", risk: "Low" },
  993: { service: "IMAPS", description: "IMAP Secure", risk: "Low" },
  995: { service: "POP3S", description: "POP3 Secure", risk: "Low" },
  1433: { service: "MSSQL", description: "Microsoft SQL Server", risk: "High" },
  3306: { service: "MySQL", description: "MySQL Database", risk: "High" },
  3389: { service: "RDP", description: "Remote Desktop Protocol", risk: "High" },
  5432: { service: "PostgreSQL", description: "PostgreSQL Database", risk: "High" },
  5900: { service: "VNC", description: "Virtual Network Computing", risk: "High" },
  8080: { service: "HTTP-Alternate", description: "Alternative HTTP port", risk: "Medium" },
  8443: { service: "HTTPS-Alternate", description: "Alternative HTTPS port", risk: "Medium" }
};

// Function to scan a single port
const scanPort = (host, port, timeout = 3000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    // Set timeout to prevent hanging
    socket.setTimeout(timeout);
    
    // Attempt to connect to the port
    socket.connect({ port, host }, () => {
      // Port is open if we can connect
      socket.destroy();
      resolve({ open: true });
    });

    // Handle connection errors (likely closed ports)
    socket.on('error', () => {
      resolve({ open: false });
    });

    // Handle connection timeouts
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ open: false });
    });
  });
};

// Function to get port information
const getPortInfo = (port, isOpen) => {
  // Use our common ports database or generate generic info
  if (commonPorts[port]) {
    return {
      open: isOpen,
      service: commonPorts[port].service,
      description: commonPorts[port].description,
      risk: isOpen ? commonPorts[port].risk : "None"
    };
  } else {
    return {
      open: isOpen,
      service: isOpen ? "Unknown" : "-",
      description: isOpen ? "Unidentified service" : "-",
      risk: isOpen ? "Medium" : "None"
    };
  }
};

// Function to determine overall risk level
const calculateRiskLevel = (openPorts) => {
  if (openPorts.length === 0) return "Low";
  
  // Check for high risk ports
  const highRiskPorts = openPorts.filter(port => 
    commonPorts[port] && commonPorts[port].risk === "High"
  );
  
  if (highRiskPorts.length > 0) return "High";
  if (openPorts.length > 5) return "Medium";
  return "Low";
};

// Main API handler function
export async function GET(request) {
  // Get URL parameters
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('host');
  let startPort = parseInt(searchParams.get('startPort'), 10);
  let endPort = parseInt(searchParams.get('endPort'), 10);
  
  // Validate input parameters
  if (!host) {
    return NextResponse.json({ error: "Host parameter is required" }, { status: 400 });
  }
  
  // Validate port range
  if (isNaN(startPort)) startPort = 1;
  if (isNaN(endPort)) endPort = startPort;
  
  // Enforce limits for performance/security
  if (endPort - startPort > 100) {
    return NextResponse.json({ 
      error: "Port range too large. Maximum scan range is 100 ports."
    }, { status: 400 });
  }
  
  try {
    const scanResults = {};
    const scanPromises = [];
    
    // Create array of ports to scan
    for (let port = startPort; port <= endPort; port++) {
      scanPromises.push(
        scanPort(host, port).then(result => {
          scanResults[port] = getPortInfo(port, result.open);
        })
      );
    }
    
    // Wait for all port scans to complete
    await Promise.all(scanPromises);
    
    // Identify which ports are open
    const openPorts = Object.keys(scanResults)
      .filter(port => scanResults[port].open)
      .map(port => parseInt(port, 10));
    
    // Prepare response data
    const response = {
      host,
      scanTime: new Date().toISOString(),
      ports: scanResults,
      summary: {
        total: Object.keys(scanResults).length,
        open: openPorts.length,
        closed: Object.keys(scanResults).length - openPorts.length,
        riskAssessment: calculateRiskLevel(openPorts)
      },
      recommendations: generateRecommendations(openPorts, scanResults)
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Port scan error:", error);
    return NextResponse.json({ 
      error: "Failed to complete port scan" 
    }, { status: 500 });
  }
}

// Generate security recommendations based on scan results
function generateRecommendations(openPorts, scanResults) {
  const recommendations = [];
  
  if (openPorts.length === 0) {
    recommendations.push("No open ports detected. Continue regular security monitoring.");
    return recommendations;
  }
  
  recommendations.push("Close unnecessary ports to reduce attack surface.");
  
  // Add specific recommendations based on detected ports
  if (openPorts.includes(21) || openPorts.includes(20)) {
    recommendations.push("FTP uses unencrypted connections. Consider using SFTP (SSH File Transfer) instead.");
  }
  
  if (openPorts.includes(23)) {
    recommendations.push("Telnet sends data in plaintext. Replace with SSH for secure remote access.");
  }
  
  if (openPorts.includes(3306) || openPorts.includes(1433) || openPorts.includes(5432)) {
    recommendations.push("Database ports should not be directly exposed to the internet. Use a VPN or SSH tunnel.");
  }
  
  if (openPorts.includes(3389)) {
    recommendations.push("RDP should be restricted to trusted IP addresses with strong authentication.");
  }
  
  // Check for HTTP without HTTPS
  if (openPorts.includes(80) && !openPorts.includes(443)) {
    recommendations.push("HTTP detected without HTTPS. Implement TLS/SSL for secure communications.");
  }
  
  return recommendations;
}
