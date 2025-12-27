const axios = require('axios');

// Piston API URL (Free, public instance)
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

// Language Mapping: Judge0 ID -> Piston Language Name & Version
const LANGUAGE_MAP = {
    71: { language: 'python', version: '3.10.0' },      // Python
    62: { language: 'java', version: '15.0.2' },        // Java
    54: { language: 'c++', version: '10.2.0' },         // C++
    63: { language: 'javascript', version: '18.15.0' }, // JavaScript (Node)
    50: { language: 'c', version: '10.2.0' }            // C
};

/**
 * Execute code using Piston API (Free Alternative to Judge0)
 * Adapts Piston's request/response to match Judge0's format to avoid breaking other files.
 */
exports.executeCode = async (sourceCode, language, stdin, expectedOutput = null) => {
    try {
        // Map input language (string or id) to Piston config
        // The controller sends specific strings "python", "java", etc.
        // But we need to be robust. Let's use a standard map based on the string name.

        let pistonConfig = null;
        switch (language.toLowerCase()) {
            case 'python': pistonConfig = { language: 'python', version: '3.10.0' }; break;
            case 'java': pistonConfig = { language: 'java', version: '15.0.2' }; break;
            case 'cpp':
            case 'c++': pistonConfig = { language: 'c++', version: '10.2.0' }; break;
            case 'javascript':
            case 'js': pistonConfig = { language: 'javascript', version: '18.15.0' }; break;
            case 'c': pistonConfig = { language: 'c', version: '10.2.0' }; break;
            default: throw new Error('Unsupported language');
        }

        const payload = {
            language: pistonConfig.language,
            version: pistonConfig.version,
            files: [
                {
                    content: sourceCode
                }
            ],
            stdin: stdin || "",
        };

        const response = await axios.post(PISTON_API_URL, payload);
        const data = response.data;

        // Adapt Piston Response to Judge0 Format
        // Piston returns: { run: { stdout: "...", stderr: "...", code: 0, signal: null } }
        // Judge0 expects: { stdout: "...", stderr: "...", status: { id: 3, description: "Accepted" } } OR similar

        const result = {
            stdout: data.run.stdout,
            stderr: data.run.stderr,
            // Piston doesn't give specific verdicts like "Wrong Answer", we infer basic status
            status: {
                id: data.run.code === 0 ? 3 : 6, // 3 = Accepted (generic success), 6 = Error (generic)
                description: data.run.code === 0 ? 'Accepted' : 'Runtime Error'
            },
            time: "0.1", // Piston doesn't always return time in same format, mock it
            memory: "0"
        };

        // Simple manual verification if expected output is provided
        if (expectedOutput && result.stdout) {
            const cleanOutput = result.stdout.trim();
            const cleanExpected = expectedOutput.trim();
            if (cleanOutput !== cleanExpected) {
                result.status.id = 4; // Wrong Answer
                result.status.description = 'Wrong Answer';
            }
        }

        return result;

    } catch (error) {
        console.error('Execution Error:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
        throw new Error('Code execution failed');
    }
};

/**
 * Get verdict from status ID
 * Kept for compatibility
 */
exports.getVerdict = (statusId) => {
    switch (statusId) {
        case 3: return 'Accepted';
        case 4: return 'Wrong Answer';
        case 5: return 'Time Limit Exceeded';
        case 6: return 'Compilation/Runtime Error';
        default: return 'Unknown Error';
    }
};
