const axios = require('axios');

// Piston API URL (Free, public instance)
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

// Language Mapping: Judge0 ID -> Piston Language Name & Version
// Note: Piston versions might update, but specifying version is safer for reproducibility.
const LANGUAGE_MAP = {
    71: { language: 'python', version: '3.10.0' },      // Python
    62: { language: 'java', version: '15.0.2' },        // Java
    54: { language: 'c++', version: '10.2.0' },         // C++
    63: { language: 'javascript', version: '18.15.0' }, // JavaScript (Node)
    50: { language: 'c', version: '10.2.0' }            // C
};

/**
 * Normalizes output by trimming trailing whitespace and unifying newlines.
 * Piston/Judge0 outputs may differ in trailing newlines.
 */
const normalizeOutput = (str) => {
    if (!str) return "";
    return str.replace(/\r\n/g, '\n').trimEnd();
};

/**
 * Execute code using Piston API (Free Alternative to Judge0)
 * Adapts Piston's request/response to match Judge0's format to avoid breaking other files.
 */
exports.executeCode = async (sourceCode, language, stdin, expectedOutput = null) => {
    try {
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
            // Piston V2 arguments
            run_timeout: 3000, // 3 seconds timeout (Piston constraint might apply)
            compile_timeout: 10000
        };

        const response = await axios.post(PISTON_API_URL, payload);
        const data = response.data;

        // --- INTELLIGENT RESULT PARSING ---

        // 1. Determine Verdict
        // Judge0 Status IDs:
        // 3: Accepted
        // 4: Wrong Answer (Determined by comparison, not here usually, but we set accepted here if run ok)
        // 5: Time Limit Exceeded
        // 6: Compilation Error
        // 11: Runtime Error (SIGSEGV, SIGABRT, Non-zero exit code)

        let statusId = 3; // Default to Accepted
        let description = 'Accepted';

        const runStage = data.run;
        const compileStage = data.compile;

        // Check for Compilation Error
        if (compileStage && compileStage.code !== 0) {
            statusId = 6;
            description = 'Compilation Error';
        }
        // Check for Runtime Signals (TLE, Segfault)
        else if (runStage.signal) {
            if (runStage.signal === 'SIGKILL' || runStage.signal === 'SIGTERM') {
                statusId = 5;
                description = 'Time Limit Exceeded';
            } else {
                statusId = 11;
                description = `Runtime Error (${runStage.signal})`;
            }
        }
        // Check for Non-Zero Exit Code (Runtime Error)
        else if (runStage.code !== 0) {
            statusId = 11;
            description = 'Runtime Error';
        }

        // 2. Prepare Output
        // If compilation error, show compile output. Else show stderr or stdout.
        let output = "";
        let errorOutput = "";

        if (statusId === 6) {
            errorOutput = compileStage.output || compileStage.stderr;
        } else {
            output = runStage.stdout;
            errorOutput = runStage.stderr;
        }

        const result = {
            stdout: output,
            stderr: errorOutput,
            compile_output: compileStage ? compileStage.output : "",
            status: {
                id: statusId,
                description: description
            },
            // Piston V2 doesn't always strictly return execution duration in ms in the public API response easily?
            // Actually it does not guarantee 'duration' field in all versions.
            // But usually we can assume fast execution if successful.
            time: "0.1",
            memory: "0"
        };

        // --- OUTPUT VERIFICATION (Moved to Controller mostly, but simple check here allowed) ---
        // Verify output manually if expected provided AND we think it's 'Accepted' so far
        if (expectedOutput && statusId === 3) {
            // Use our normalize helper
            const cleanOutput = normalizeOutput(result.stdout);
            const cleanExpected = normalizeOutput(expectedOutput);

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
        case 6: return 'Compilation Error';
        case 11: return 'Runtime Error';
        default: return 'Unknown Error';
    }
};
