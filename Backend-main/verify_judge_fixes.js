const judgeService = require('./services/judge.service');
const { executeTestCases } = require('./controllers/problem.controller');

// MOCK judgeService output for testing controller logic directly? 
// Or better, test logic functions. 
// Since strict integration testing requires real Piston API, I will verify the 'logic' by creating a small test script that imports the helper functions if they were exported, or just manually verify the flow.

// Actually, I can write a script that sends a real request to Piston via the service to verify the parsing.
// AND I can simulate the 'comparison' logic by creating a mock controller environment.

const runVerification = async () => {
    console.log("--- Starting QA Verification ---");

    // 1. Verify Real Piston Execution (Python Hello World)
    console.log("\n1. Testing Piston API Connectivity & Parsing...");
    try {
        const result = await judgeService.executeCode('print("hello")', 'python', '');
        console.log("Result:", result);
        if (result.stdout.trim() === 'hello' && result.status.id === 3) {
            console.log("✅ Basic Execution Passed");
        } else {
            console.log("❌ Basic Execution Failed");
        }
    } catch (e) {
        console.log("❌ Execution Error:", e.message);
    }

    // 2. Verify Infinite Loop (TLE) detection
    // Note: This relies on Piston actually killing it.
    console.log("\n2. Testing TLE Detection (Infinite Loop)...");
    try {
        const result = await judgeService.executeCode('while True: pass', 'python', '');
        console.log("Result:", result.status);
        if (result.status.id === 5 || result.status.description === 'Time Limit Exceeded') {
            console.log("✅ TLE Detection Passed");
        } else {
            console.log("❌ TLE Detection Failed (Result was " + result.status.description + ")");
        }
    } catch (e) {
        console.log("❌ TLE Execution Error:", e.message);
    }

    console.log("\n--- Verification Complete ---");
};

runVerification();
