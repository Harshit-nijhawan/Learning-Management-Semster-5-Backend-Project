const judgeService = require('./services/judge.service');
const aiService = require('./services/ai.service');

const runVerification = async () => {
    console.log("--- Starting FINAL QA Verification ---");

    // 1. Verify Real Piston Execution (Python Hello World)
    console.log("\n1. Testing Piston API Connectivity & Parsing...");
    try {
        const result = await judgeService.executeCode('print("hello")', 'python', '');
        if (result.stdout.trim() === 'hello' && result.status.id === 3) {
            console.log("✅ Basic Execution Passed");
        } else {
            console.log("❌ Basic Execution Failed");
            console.log(result);
        }
    } catch (e) {
        console.log("❌ Execution Error:", e.message);
    }

    // 2. Verify Infinite Loop (TLE) detection
    console.log("\n2. Testing TLE Detection (Infinite Loop)...");
    try {
        const result = await judgeService.executeCode('while True: pass', 'python', '');
        if (result.status.id === 5 || result.status.description.includes('Time Limit')) {
            console.log("✅ TLE Detection Passed");
        } else {
            console.log("❌ TLE Detection Failed (Result: " + result.status.description + ")");
        }
    } catch (e) {
        console.log("❌ TLE Execution Error:", e.message);
    }

    // 3. Verify AI Code Audit (USP)
    console.log("\n3. Testing AI Code Audit (Gemini)...");
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.log("⚠️  Skipping AI Test: GEMINI_API_KEY not found in process.env");
        } else {
            const audit = await aiService.generateCodeAudit(
                'def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]',
                'python',
                'Two Sum'
            );

            console.log("AI Response:", JSON.stringify(audit, null, 2));

            if (audit.grade && audit.feedback && audit.suggestions) {
                console.log("✅ AI Audit Passed (Structured JSON received)");
                if (audit.timeComplexity.includes("O(n^2)") || audit.timeComplexity.includes("O(n²)")) {
                    console.log("✅ AI Correctly Identified O(n^2) Complexity");
                }
            } else {
                console.log("❌ AI Audit Failed (Invalid Structure)");
            }
        }
    } catch (e) {
        console.log("❌ AI Audit Error:", e.message);
    }

    console.log("\n--- Verification Complete ---");
};

// Start
require('dotenv').config(); // Ensure env vars are loaded
runVerification();
