const DailyQuestion = require('../models/DailyQuestion');
const { VM } = require('vm2');

// Get today's daily question
exports.getTodaysQuestion = async (req, res) => {
  try {
    const question = await DailyQuestion.getTodaysQuestion();
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'No daily question available' 
      });
    }

    // Don't send hidden test cases to frontend
    const publicQuestion = {
      ...question.toObject(),
      testCases: question.testCases.filter(tc => !tc.isHidden)
    };

    res.status(200).json({
      success: true,
      question: publicQuestion
    });
  } catch (error) {
    console.error('Error fetching daily question:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching daily question' 
    });
  }
};

// Get user's submission history for today's question
exports.getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const question = await DailyQuestion.getTodaysQuestion();
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'No daily question available' 
      });
    }

    const userSubmissions = question.submissions
      .filter(sub => sub.userId.toString() === userId)
      .sort((a, b) => b.submittedAt - a.submittedAt);

    res.status(200).json({
      success: true,
      submissions: userSubmissions
    });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching submissions' 
    });
  }
};

// Submit solution
exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code and language are required' 
      });
    }

    const question = await DailyQuestion.getTodaysQuestion();
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: 'No daily question available' 
      });
    }

    // Run test cases
    const result = await runTestCases(code, language, question.testCases);

    // Create submission record
    const submission = {
      userId,
      code,
      language,
      status: result.status,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      runtime: result.runtime,
      submittedAt: new Date()
    };

    question.submissions.push(submission);
    question.totalSubmissions += 1;
    
    if (result.status === 'accepted') {
      question.totalAccepted += 1;
    }
    
    question.updateAcceptanceRate();
    await question.save();

    res.status(200).json({
      success: true,
      result: {
        status: result.status,
        passedTests: result.passedTests,
        totalTests: result.totalTests,
        runtime: result.runtime,
        testResults: result.testResults,
        message: result.message
      }
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting solution',
      error: error.message 
    });
  }
};

// Run code against test cases
async function runTestCases(code, language, testCases) {
  const startTime = Date.now();
  let passedTests = 0;
  const testResults = [];

  try {
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const result = await executeCode(code, language, testCase.input);
        const passed = result.trim() === testCase.expectedOutput.trim();
        
        if (passed) passedTests++;
        
        testResults.push({
          testNumber: i + 1,
          input: testCase.isHidden ? 'Hidden' : testCase.input,
          expectedOutput: testCase.isHidden ? 'Hidden' : testCase.expectedOutput,
          actualOutput: testCase.isHidden ? 'Hidden' : result,
          passed,
          isHidden: testCase.isHidden
        });

        if (!passed && !testCase.isHidden) {
          break; // Stop at first failing visible test
        }
      } catch (error) {
        testResults.push({
          testNumber: i + 1,
          input: testCase.isHidden ? 'Hidden' : testCase.input,
          expectedOutput: testCase.isHidden ? 'Hidden' : testCase.expectedOutput,
          actualOutput: 'Runtime Error',
          passed: false,
          error: error.message,
          isHidden: testCase.isHidden
        });
        
        return {
          status: 'runtime-error',
          passedTests,
          totalTests: testCases.length,
          runtime: Date.now() - startTime,
          testResults,
          message: `Runtime Error: ${error.message}`
        };
      }
    }

    const runtime = Date.now() - startTime;
    const status = passedTests === testCases.length ? 'accepted' : 'wrong-answer';

    return {
      status,
      passedTests,
      totalTests: testCases.length,
      runtime,
      testResults,
      message: status === 'accepted' ? 'All test cases passed!' : 'Some test cases failed'
    };
  } catch (error) {
    return {
      status: 'runtime-error',
      passedTests,
      totalTests: testCases.length,
      runtime: Date.now() - startTime,
      testResults,
      message: `Error: ${error.message}`
    };
  }
}

// Execute code in sandbox (JavaScript only for now)
async function executeCode(code, language, input) {
  if (language === 'javascript') {
    const vm = new VM({
      timeout: 3000,
      sandbox: {}
    });

    // Wrap code to capture console output
    const wrappedCode = `
      let output = '';
      const console = {
        log: (...args) => { output += args.join(' ') + '\\n'; }
      };
      
      ${code}
      
      // Try to call the main function if it exists
      if (typeof solution !== 'undefined') {
        const result = solution(${input});
        console.log(result);
      }
      
      output.trim();
    `;

    return vm.run(wrappedCode);
  } else {
    throw new Error(`Language ${language} is not supported yet. Currently only JavaScript is supported.`);
  }
}

// Get all daily questions (admin only)
exports.getAllDailyQuestions = async (req, res) => {
  try {
    const questions = await DailyQuestion.find()
      .sort({ date: -1 })
      .select('-submissions -testCases');

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('Error fetching daily questions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching daily questions' 
    });
  }
};

// Create new daily question (admin only)
exports.createDailyQuestion = async (req, res) => {
  try {
    const question = new DailyQuestion(req.body);
    await question.save();

    res.status(201).json({
      success: true,
      message: 'Daily question created successfully',
      question
    });
  } catch (error) {
    console.error('Error creating daily question:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating daily question',
      error: error.message
    });
  }
};

// Get user's streak and stats
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all questions
    const allQuestions = await DailyQuestion.find().sort({ date: -1 });
    
    let solvedCount = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let lastSolvedDate = null;

    // Calculate stats
    for (const question of allQuestions) {
      const userSubmissions = question.submissions.filter(
        sub => sub.userId.toString() === userId && sub.status === 'accepted'
      );

      if (userSubmissions.length > 0) {
        solvedCount++;
        
        const solvedDate = new Date(question.date);
        solvedDate.setHours(0, 0, 0, 0);
        
        if (!lastSolvedDate) {
          tempStreak = 1;
          lastSolvedDate = solvedDate;
        } else {
          const dayDiff = Math.floor((lastSolvedDate - solvedDate) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 1) {
            tempStreak++;
          } else {
            if (tempStreak > maxStreak) maxStreak = tempStreak;
            tempStreak = 1;
          }
          lastSolvedDate = solvedDate;
        }
      }
    }

    if (tempStreak > maxStreak) maxStreak = tempStreak;
    
    // Current streak is valid only if last solved was yesterday or today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastSolvedDate) {
      const daysSinceLastSolved = Math.floor((today - lastSolvedDate) / (1000 * 60 * 60 * 24));
      currentStreak = daysSinceLastSolved <= 1 ? tempStreak : 0;
    }

    res.status(200).json({
      success: true,
      stats: {
        solvedCount,
        totalQuestions: allQuestions.length,
        currentStreak,
        maxStreak
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user stats' 
    });
  }
};
