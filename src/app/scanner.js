const net = require("net");

const scanPort = (host, port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000); // Timeout to prevent hanging

    socket.connect(port, host, () => {
      resolve({ port, status: "Open" });
      socket.destroy();
    });

    socket.on("error", () => {
      resolve({ port, status: "Closed" });
    });

    socket.on("timeout", () => {
      resolve({ port, status: "Timed Out" });
      socket.destroy();
    });
  });
};

const scanWebsitePorts = async (host) => {
  const commonPorts = [80, 443, 22, 3306, 8080, 25]; // Add more as needed
  const results = await Promise.all(commonPorts.map((port) => scanPort(host, port)));

  console.table(results); // Display results in a table format
};

scanWebsitePorts("example.com");
