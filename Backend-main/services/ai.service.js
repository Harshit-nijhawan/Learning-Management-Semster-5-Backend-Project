const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a professional senior-level code audit using Gemini.
 * @param {string} code - The user's source code
 * @param {string} language - The programming language
 * @param {string} problemTitle - Context for the problem
 * @returns {Promise<Object>} - Structured audit report
 */
exports.generateCodeAudit = async (code, language, problemTitle) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are a Senior Staff Software Engineer at a FAANG company. 
      Your task is to review a candidate's solution for a coding problem.
      
      Problem: ${problemTitle}
      Language: ${language}
      
      Code:
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Analyze the code strictly for:
      1. Time & Space Complexity (Big O)
      2. Code Quality & Readability (Variable naming, modularity)
      3. Best Practices (Security, Error handling, Language usage)
      4. Potential Bugs or Edge Cases missed
      
      Output ONLY a JSON object with this exact structure (no markdown, no intro):
      {
        "grade": "A/B/C/D/F",
        "qualityScore": <number 0-100>,
        "timeComplexity": "O(...)",
        "spaceComplexity": "O(...)",
        "feedback": "A concise professional summary of the review (max 2 sentences).",
        "suggestions": [
          "Specific actionable improvement 1",
          "Specific actionable improvement 2",
          "Specific actionable improvement 3"
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown formatting user might send (e.g. ```json ... ```)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("AI Audit Error:", error);
        // Fallback in case of AI failure/parsing error to avoid crashing UI
        return {
            grade: "N/A",
            qualityScore: 0,
            timeComplexity: "Unknown",
            spaceComplexity: "Unknown",
            feedback: "The AI auditor is currently unavailable. Please try again later.",
            suggestions: ["Check your API Key configuration.", "Ensure code is valid."]
        };
    }
};
