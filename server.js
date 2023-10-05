// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const os = require('os');
const osUtils = require('os-utils');


// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for the homepage
app.get('/', (req, res) => {
    res.send('Welcome to the Express.js template!');
});

// Define a route for representing memory status updates
app.get('/mem', (req, res) => {

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    // Calculate used memory in bytes
    const usedMemory = totalMemory - freeMemory;

    // Convert memory sizes to more human-readable units (e.g., MB or GB)
    function formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round((bytes / Math.pow(1024, i))) + ' ' + sizes[i];
    }

    // Display memory information
    const memData = {
        TotalMemory: formatBytes(totalMemory),
        FreeMemory: formatBytes(freeMemory),
        UsedMemory: formatBytes(usedMemory)
    };
    res.send(JSON.stringify(memData))

});

// Define an Express route to get OS information
app.get('/osinfo', (req, res) => {
    const osName = os.type();
    const osVersion = os.release();

    const osInfo = {
        name: osName,
        version: osVersion
    };

    res.send(JSON.stringify(osInfo));
});

// Define an Express route to get CPU information
app.get('/cpuinfo', (req, res) => {
    // Get CPU model and number of cores from os module
    const uptimeInSeconds = os.uptime();
    const cpuInfo = {
        model: os.cpus()[0].model,
        cores: os.cpus().length,
        systemUptime: formatUptime(uptimeInSeconds)
    };

    res.send(JSON.stringify(cpuInfo));
});


// CPU USAGE (ACCURATE :-)
app.get('/cpu', (req, res) => {
    osUtils.cpuUsage((cpuUsage) => {
        const cpuInfo = cpuUsage * 100;
        res.send(JSON.stringify(cpuInfo));
    });
});


// Define an Express route to get network information 
app.get('/network', (req, res) => {

    // Get IP address and MAC address
    const networkInfo = {
        ipAddress: getIPAddress(),
        macAddress: getMACAddress(),
    };
    res.send(JSON.stringify(networkInfo));
});


// Function to get the IP address
function getIPAddress() {
    const ifaces = os.networkInterfaces();
    for (const iface in ifaces) {
        const addresses = ifaces[iface];
        for (const address of addresses) {
            if (!address.internal && address.family === 'IPv4') {
                return address.address;
            }
        }
    }
    return 'Not Found';
}

// Function to get the MAC address
function getMACAddress() {
    const ifaces = os.networkInterfaces();
    for (const iface in ifaces) {
        const addresses = ifaces[iface];
        for (const address of addresses) {
            if (!address.internal && address.family === 'IPv4') {
                return address.mac;
            }
        }
    }
    return 'Not Found';
}


// Convert uptime to a more human-readable format (e.g., days, hours, minutes)
const formatUptime = (uptime) => {
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / 3600) % 24);
    const days = Math.floor(uptime / 86400);
  
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
