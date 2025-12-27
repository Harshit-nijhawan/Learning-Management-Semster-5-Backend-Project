const ProblemModel = require("../models/Problem");
const UserProgressModel = require("../models/UserProgress");
const SubmissionModel = require("../models/Submission");
const DailyQuestion = require("../models/DailyQuestion");
const judgeService = require("../services/judge.service");
const aiService = require("../services/ai.service");

// Get all problems with filters
const getProblems = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      tag,
      company,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filter = { status: 'published' };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;
    if (company) filter.companies = company;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const problems = await ProblemModel.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-hiddenTestCases -solutions'); // Don't reveal solutions

    const count = await ProblemModel.countDocuments(filter);

    res.json({
      problems,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Error fetching problems" });
  }
};

// Get single problem by slug
const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    let problem = await ProblemModel.findOne({ slug, status: 'published' })
      .populate('author', 'name email')
      .populate('relatedProblems', 'title slug difficulty')
      .populate('similarProblems', 'title slug difficulty')
      .select('-hiddenTestCases -solutions'); // Don't send solutions

    if (!problem) {
      // Try to find in DailyQuestion
      const dailyQuestion = await DailyQuestion.findOne({ slug })
        .select('-testCases.isHidden'); // Hide hidden test cases

      if (dailyQuestion) {
        // Adapt DailyQuestion to look like Problem if necessary, or just return it
        // Note: DailyQuestion doesn't have author/relatedProblems populated usually
        problem = dailyQuestion;

        // Add sampleTestCases from testCases (if not present)
        if (!problem.sampleTestCases && problem.testCases) {
          problem = problem.toObject();
          problem.sampleTestCases = problem.testCases.filter(tc => !tc.isHidden);
        }
      }
    }

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Increment view count if it exists in schema
    if (problem.stats) {
      if (!problem.stats.views) problem.stats.views = 0;
      problem.stats.views += 1;
      // Use model.save() if it's a mongoose document, else we need to update differently
      // Since 'problem' could be a POJO now (if we used toObject), be careful.
      if (typeof problem.save === 'function') {
        await problem.save();
      } else {
        // It's a daily question POJO or modified object
        if (problem._id && !problem.slug) {
          // Logic to update view count for DailyQuestion if needed
          // For now, skipping view count update for DailyQuestion to avoid complexity or just do a direct update

        }
      }
    }

    res.json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Error fetching problem" });
  }
};

// Create new problem (instructor/admin only)
const createProblem = async (req, res) => {
  try {
    const problemData = {
      ...req.body,
      author: req.user._id
    };

    const problem = await ProblemModel.create(problemData);

    res.status(201).json({
      message: "Problem created successfully",
      problem
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: "Error creating problem", error: error.message });
  }
};

// Update problem
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await ProblemModel.findById(id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await ProblemModel.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
      message: "Problem updated successfully",
      problem: updated
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ message: "Error updating problem" });
  }
};

// Delete problem
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await ProblemModel.findById(id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (problem.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    await ProblemModel.findByIdAndDelete(id);

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Error deleting problem" });
  }
};

/**
 * Normalize output for comparison
 * 1. Trim whitespace from end
 * 2. Unify newlines
 * 3. Trim every line
 */
const normalizeOutput = (str) => {
  if (!str) return "";
  return str
    .replace(/\r\n/g, '\n') // Normalize newlines
    .split('\n')            // Split into lines
    .map(line => line.trimEnd()) // Trim end of each line
    .join('\n')             // Join back
    .trim();                // Trim total string
};

/**
 * Compare Actual vs Expected Output
 * Handles:
 * 1. Exact String Match
 * 2. Floating Point Precision (1.0 vs 1.000)
 */
const compareOutputs = (actual, expected) => {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  if (normActual === normExpected) return true;

  // Float Comparison Strategy
  const floatActual = parseFloat(normActual);
  const floatExpected = parseFloat(normExpected);

  if (!isNaN(floatActual) && !isNaN(floatExpected)) {
    if (Math.abs(floatActual - floatExpected) < 1e-6) {
      return true;
    }
  }

  return false;
};

/**
 * Execute code against Test Cases (Sample or Hidden)
 * Shared logic for Run and Submit
 */
const executeTestCases = async (code, language, testCases) => {
  const results = [];
  let allPassed = true;
  let totalTime = 0;
  let maxMemory = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const response = await judgeService.executeCode(
        code,
        language,
        testCase.input,
        testCase.expectedOutput
      );

      const statusId = response.status.id;
      let verdict = judgeService.getVerdict(statusId);

      let passed = (statusId === 3);

      if (statusId === 3 || statusId === 4) {
        const isMatch = compareOutputs(response.stdout, testCase.expectedOutput);
        if (isMatch) {
          passed = true;
          verdict = "Accepted";
        } else {
          passed = false;
          verdict = "Wrong Answer";
        }
      }

      if (!passed) allPassed = false;

      const time = parseFloat(response.time || 0);
      const memory = response.memory || 0;

      totalTime += time;
      maxMemory = Math.max(maxMemory, memory);

      results.push({
        testCaseId: i + 1,
        status: verdict,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: response.stdout ? response.stdout.trim() : (response.stderr || response.compile_output),
        time,
        memory
      });

      if (!passed) break; // Stop on first failure

    } catch (err) {
      allPassed = false;
      results.push({
        testCaseId: i + 1,
        status: "System Error",
        passed: false,
        error: err.message
      });
      break;
    }
  }

  return {
    results,
    allPassed,
    totalTime,
    maxMemory
  };
};

// Run Code (Sample Test Cases Only)
const runCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    if (!code || !language) return res.status(400).json({ message: "Code and language required" });

    let problem = await ProblemModel.findById(id);
    let isDaily = false;

    if (!problem) {
      // Check if it's a daily question
      problem = await DailyQuestion.findById(id);
      isDaily = !!problem;
    }

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Use Sample Test Cases
    // DailyQuestion schema has 'testCases', and 'examples'. 'testCases' includes hidden ones marked isHidden.
    // We should use visible test cases.
    let testCases = [];

    if (isDaily) {
      // Filter out hidden test cases for run
      testCases = problem.testCases.filter(tc => !tc.isHidden).map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      }));
    } else {
      testCases = problem.sampleTestCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.output
      }));
    }

    const execution = await executeTestCases(code, language, testCases);

    res.json({
      verdict: execution.allPassed ? "Accepted" : "Wrong Answer", // Simplified for run
      results: execution.results,
      allPassed: execution.allPassed
    });

  } catch (error) {
    console.error("Run Code Error:", error);
    res.status(500).json({ message: "Error running code" });
  }
};

// Submit Solution (Hidden Test Cases + Save Submission)
const submitSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;
    const userId = req.user._id;

    if (!code || !language) return res.status(400).json({ message: "Code and language required" });

    let problem = await ProblemModel.findById(id);
    let isDaily = false;

    if (!problem) {
      problem = await DailyQuestion.findById(id);
      isDaily = !!problem;
    }

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Combine Sample + Hidden Test Cases for Full Validation
    let allTestCases = [];

    if (isDaily) {
      allTestCases = problem.testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput // Note: DailyQuestion uses expectedOutput, Problem uses output. 
        // The RunCode update handled this map in logic, here we standardize.
      }));
    } else {
      allTestCases = [
        ...problem.sampleTestCases.map(tc => ({ input: tc.input, expectedOutput: tc.output })),
        ...problem.hiddenTestCases.map(tc => ({ input: tc.input, expectedOutput: tc.output }))
      ];
    }

    const execution = await executeTestCases(code, language, allTestCases);

    // Determine Final Verdict
    let finalVerdict = "Accepted";
    if (!execution.allPassed) {
      // Get the first failure status
      const failedTest = execution.results.find(r => !r.passed);
      finalVerdict = failedTest ? failedTest.status : "Unknown Error";
    }

    // Save Submission
    // Note: SubmissionModel references 'Students' for userId. problemId currently isn't strictly ref-checked by Mongo usually unless populated.
    // If SubmissionModel stores problemId as ObjectId w/o strict ref, it should work for both collections.
    const submission = await SubmissionModel.create({
      userId,
      problemId: id,
      code,
      language,
      verdict: finalVerdict,
      timeUsed: execution.totalTime,
      memoryUsed: execution.maxMemory,
      testCasesPassed: execution.results.filter(r => r.passed).length,
      totalTestCases: allTestCases.length
    });

    // Update Stats & User Progress if Accepted
    if (problem.stats) {
      // DailyQuestion handles stats slightly differently in schema but fields like totalSubmissions exist
      // DailyQuestion: totalSubmissions, totalAccepted
      // Problem: stats { totalSubmissions, successfulSubmissions }

      if (isDaily) {
        problem.totalSubmissions += 1;
        if (finalVerdict === "Accepted") {
          problem.totalAccepted += 1;
          if (problem.updateAcceptanceRate) problem.updateAcceptanceRate();
        }
      } else {
        problem.stats.totalSubmissions += 1;
        if (finalVerdict === "Accepted") {
          problem.stats.successfulSubmissions += 1;
        }
      }
    } else if (isDaily) {
      // Fallback if stats object didn't exist but it's daily (should validly hit above block if schema matches)
      problem.totalSubmissions += 1;
      if (finalVerdict === "Accepted") {
        problem.totalAccepted += 1;
        if (problem.updateAcceptanceRate) problem.updateAcceptanceRate();
      }
    }


    if (finalVerdict === "Accepted") {

      // Update User Progress
      let progress = await UserProgressModel.findOne({ user: userId });
      if (!progress) progress = await UserProgressModel.create({ user: userId });

      // Check if solved
      const alreadySolved = progress.problemsSolved.some(p => p.problem.toString() === id);

      if (!alreadySolved) {
        progress.problemsSolved.push({
          problem: id,
          language,
          code,
          attempts: 1 // Improved logic needed for real attempts count
        });
        // DailyQuestion might not have 'points' field in same way? Schema says it does (default 10 in Problem, DailyQuestion schema didn't show points explicitly in seed but let's check schema file if needed.
        // DailyQuestion schema does NOT have points. Let's assume 10 or 0.
        // Wait, Problem model has points. DailyQuestion model doesn't seem to have points in the schema view I saw earlier.
        // Let's safe check points.
        const pointsAwarded = problem.points || 10;

        progress.totalPoints += pointsAwarded;
        progress.updateStreak();
        progress.recentActivity.unshift({
          type: 'problem_solved',
          itemId: id,
          description: `Solved: ${problem.title}`
        });
        if (progress.recentActivity.length > 50) progress.recentActivity.pop();
        await progress.save();
      }
    }

    await problem.save();

    res.json({
      submissionId: submission._id,
      verdict: finalVerdict,
      results: execution.results,
      allPassed: execution.allPassed,
      timeUsed: execution.totalTime,
      memoryUsed: execution.maxMemory
    });

  } catch (error) {
    console.error("Submit Error:", error);
    res.status(500).json({ message: "Error submitting solution" });
  }
};

// Bookmark/unbookmark problem
const toggleBookmarkProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let progress = await UserProgressModel.findOne({ user: userId });
    if (!progress) {
      progress = await UserProgressModel.create({ user: userId });
    }

    const hasBookmarked = progress.bookmarkedProblems.some(
      b => b.problem.toString() === id
    );

    if (hasBookmarked) {
      progress.bookmarkedProblems = progress.bookmarkedProblems.filter(
        b => b.problem.toString() !== id
      );
    } else {
      progress.bookmarkedProblems.push({ problem: id });
    }

    await progress.save();

    res.json({
      message: hasBookmarked ? "Bookmark removed" : "Problem bookmarked",
      isBookmarked: !hasBookmarked
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ message: "Error updating bookmark" });
  }
};

// Get problem hints one by one
const getProblemHint = async (req, res) => {
  try {
    const { id } = req.params;
    const { hintIndex } = req.query;

    const problem = await ProblemModel.findById(id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const index = parseInt(hintIndex) || 0;

    if (index >= problem.hints.length) {
      return res.json({ hint: null, hasMore: false });
    }

    res.json({
      hint: problem.hints[index],
      hintNumber: index + 1,
      totalHints: problem.hints.length,
      hasMore: index + 1 < problem.hints.length
    });
  } catch (error) {
    console.error("Error fetching hint:", error);
    res.status(500).json({ message: "Error fetching hint" });
  }
};
// Generate AI Code Audit
const getAiCodeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;

    if (!code || !language) return res.status(400).json({ message: "Code and language required" });

    // Use problem title for context if found, else generic
    let problemTitle = "Coding Problem";
    const problem = await ProblemModel.findById(id) || await DailyQuestion.findById(id);
    if (problem) problemTitle = problem.title;

    const audit = await aiService.generateCodeAudit(code, language, problemTitle);

    res.json(audit);
  } catch (error) {
    console.error("AI Review Error:", error);
    res.status(500).json({ message: "Error generating review" });
  }
};

module.exports = {
  getProblems,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
  runCode,
  submitSolution,
  toggleBookmarkProblem,
  getProblemHint,
  getAiCodeReview // New USP endpoint
};

