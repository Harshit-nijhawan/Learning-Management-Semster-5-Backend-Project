const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

// Language IDs mapping for Judge0
const LANGUAGE_IDS = {
    python: 71, // Python (3.8.1)
    java: 62,   // Java (OpenJDK 13.0.1)
    cpp: 54,    // C++ (GCC 9.2.0)
    javascript: 63, // JavaScript (Node.js 12.14.0)
    c: 50       // C (GCC 9.2.0)
};

/**
 * Execute code using Judge0
 * @param {string} sourceCode 
 * @param {string} language 
 * @param {string} stdin - Input for the program
 * @param {string} expectedOutput - Expected output to check against (optional)
 */
exports.executeCode = async (sourceCode, language, stdin, expectedOutput = null) => {
    try {
        const languageId = LANGUAGE_IDS[language.toLowerCase()];
        if (!languageId) throw new Error('Unsupported language');

        const headers = { 'Content-Type': 'application/json' };

        // Add RapidAPI Headers if API Key is present
        if (JUDGE0_API_KEY) {
            headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
            headers['X-RapidAPI-Host'] = JUDGE0_API_HOST;
        }

        // Base64 encode code and input to avoid encoding issues
        const options = {
            method: 'POST',
            url: `${JUDGE0_URL}/submissions`,
            params: { base64_encoded: 'true', wait: 'true' },
            headers: headers,
            data: {
                source_code: Buffer.from(sourceCode).toString('base64'),
                language_id: languageId,
                stdin: Buffer.from(stdin || "").toString('base64'),
                expected_output: expectedOutput ? Buffer.from(expectedOutput).toString('base64') : null
            }
        };

        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Judge0 Execution Error:', error.message);
        // Improved error logging for RapidAPI issues
        if (error.response) {
            console.error('Data:', error.response.data);
            console.error('Status:', error.response.status);
        }
        throw new Error('Code execution failed');
    }
};

/**
 * Get verdict from status ID
 * @param {number} statusId 
 */
exports.getVerdict = (statusId) => {
    // Judge0 Status IDs:
    // 3: Accepted
    // 4: Wrong Answer
    // 5: Time Limit Exceeded
    // 6: Compilation Error
    // 7-12: Runtime Error
    switch (statusId) {
        case 3: return 'Accepted';
        case 4: return 'Wrong Answer';
        case 5: return 'Time Limit Exceeded';
        case 6: return 'Compilation Error';
        default:
            if (statusId >= 7 && statusId <= 12) return 'Runtime Error';
            return 'Unknown Error';
    }
};
