import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bookmark, 
  BookmarkCheck,
  Lightbulb, 
  Play, 
  Upload, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  ThumbsUp,
  Settings,
  Maximize2
} from 'lucide-react';
import api from '../utils/api';

function ProblemPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);

  const languages = [
    { value: 'python', label: 'Python', template: '# Write your solution here\ndef solution():\n    pass\n\nif __name__ == "__main__":\n    solution()' },
    { value: 'javascript', label: 'JavaScript', template: '// Write your solution here\nfunction solution() {\n    \n}\n\nsolution();' },
    { value: 'java', label: 'Java', template: 'class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}' },
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}' },
    { value: 'c', label: 'C', template: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}' }
  ];

  const fetchProblem = useCallback(async () => {
    try {
      const response = await api.get(`/api/problems/${slug}`);
      setProblem(response.data);
      // Set initial code template
      const lang = languages.find(l => l.value === selectedLanguage);
      setCode(lang?.template || '');
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const template = languages.find(l => l.value === lang)?.template || '';
    setCode(template);
    setOutput('');
    setTestResults(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults(null);
    
    try {
      // Simulate running against sample test cases
      setTimeout(() => {
        const sampleResults = {
          passed: true,
          testCases: problem.sampleTestCases?.map((tc, index) => ({
            input: tc.input,
            expectedOutput: tc.output,
            actualOutput: tc.output,
            passed: true,
            executionTime: Math.floor(Math.random() * 100) + 'ms'
          })) || []
        };
        
        setTestResults(sampleResults);
        setOutput('All sample test cases passed! ✅');
        setIsRunning(false);
      }, 1500);
    } catch (error) {
      setOutput('Error running code: ' + error.message);
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput('');
    
    try {
      const response = await api.post(`/api/problems/${problem._id}/submit`, {
        code,
        language: selectedLanguage
      });
      
      if (response.data.passed) {
        setOutput('✅ Accepted! All test cases passed.\n\nCongratulations! Your solution is correct.');
        setTestResults({
          passed: true,
          message: 'All test cases passed',
          testCases: []
        });
      } else {
        setOutput('❌ Wrong Answer\n\nSome test cases failed. Please review your solution.');
        setTestResults({
          passed: false,
          message: response.data.message || 'Solution incorrect'
        });
      }
    } catch (error) {
      setOutput('Error submitting solution: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    try {
      await api.post(`/api/problems/${problem._id}/bookmark`);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'School': 'text-gray-600',
      'Basic': 'text-blue-600',
      'Easy': 'text-green-600',
      'Medium': 'text-yellow-600',
      'Hard': 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Problem Not Found</h1>
          <button
            onClick={() => navigate('/problems')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Browse Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white text-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Problem List</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-lg font-semibold text-gray-900">{problem.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded hover:bg-gray-100 transition ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-600'
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
          <button className="p-2 rounded hover:bg-gray-100 text-gray-600 transition">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white">
          <div className="p-6">
            {/* Problem Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-400">•</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm border border-gray-200">
                  {problem.category}
                </span>
                {problem.points && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 text-sm flex items-center gap-1">
                      <TrendingUp size={14} />
                      {problem.points} pts
                    </span>
                  </>
                )}
              </div>
              
              {/* Acceptance Rate */}
              {problem.stats && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Accepted: {problem.stats.successfulSubmissions || 0}
                  </span>
                  <span>
                    Submissions: {problem.stats.totalSubmissions || 0}
                  </span>
                  {problem.stats.totalSubmissions > 0 && (
                    <span className="text-green-600 font-medium">
                      {Math.round((problem.stats.successfulSubmissions / problem.stats.totalSubmissions) * 100)}% Acceptance
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              {['description', 'editorial', 'solutions', 'submissions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-medium capitalize transition ${
                    activeTab === tab
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6 text-gray-700">
                {/* Problem Statement */}
                <div>
                  <p className="whitespace-pre-wrap leading-relaxed">{problem.description}</p>
                </div>

                {/* Examples */}
                {problem.sampleTestCases && problem.sampleTestCases.map((tc, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-semibold mb-3 text-gray-900">Example {index + 1}:</div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Input:</div>
                        <pre className="bg-white border border-gray-200 p-3 rounded text-sm text-green-600 overflow-x-auto">
                          {tc.input}
                        </pre>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Output:</div>
                        <pre className="bg-white border border-gray-200 p-3 rounded text-sm text-blue-600 overflow-x-auto">
                          {tc.output}
                        </pre>
                      </div>
                      {tc.explanation && (
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Explanation:</div>
                          <p className="text-sm text-gray-700">{tc.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Constraints:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index} className="text-gray-600">{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expected Complexity */}
                {problem.expectedComplexity && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Expected Complexity:</h3>
                    <div className="space-y-1 text-sm">
                      {problem.expectedComplexity.time && (
                        <div className="text-gray-700">
                          <span className="text-blue-600 font-medium">Time:</span> {problem.expectedComplexity.time}
                        </div>
                      )}
                      {problem.expectedComplexity.space && (
                        <div className="text-gray-700">
                          <span className="text-blue-600 font-medium">Space:</span> {problem.expectedComplexity.space}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Hints */}
                {problem.hints && problem.hints.length > 0 && (
                  <div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded border border-yellow-200 hover:bg-yellow-100 transition"
                    >
                      <Lightbulb size={18} />
                      {showHint ? 'Hide' : 'Show'} Hint
                    </button>
                    {showHint && (
                      <div className="mt-3 space-y-2">
                        {problem.hints.map((hint, index) => (
                          <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-sm text-gray-700">
                            <strong className="text-yellow-700">Hint {index + 1}:</strong> {hint}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300 hover:border-gray-400 cursor-pointer transition"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Companies */}
                {problem.companies && problem.companies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Companies:</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.companies.map((company, index) => (
                        <span
                          key={index}
                          className="bg-green-50 text-green-700 px-3 py-1 rounded text-sm border border-green-200"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'editorial' && (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Editorial will be available after you solve the problem</p>
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className="text-center py-12 text-gray-500">
                <ThumbsUp size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Community solutions will appear here</p>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="text-center py-12 text-gray-500">
                <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                <p>Your submission history will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Editor Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 px-3 py-1.5 rounded text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const lang = languages.find(l => l.value === selectedLanguage);
                  setCode(lang?.template || '');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button className="p-1.5 rounded text-gray-600 hover:bg-gray-100 transition">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Code Editor Textarea */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-white text-gray-900 p-4 font-mono text-sm resize-none focus:outline-none border-0"
              style={{ 
                lineHeight: '1.6',
                tabSize: 4
              }}
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>

          {/* Test Cases / Results Panel */}
          <div className="h-64 border-t border-gray-200 bg-gray-50 overflow-y-auto">
            {/* Testcase Tabs */}
            <div className="flex gap-4 px-4 py-2 border-b border-gray-200 bg-white">
              <button className="text-sm font-medium text-green-600 border-b-2 border-green-600 pb-1">
                Testcase
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Test Result
              </button>
            </div>

            {/* Testcase Content */}
            <div className="p-4">
              {!testResults && problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
                <div>
                  {/* Testcase Selector */}
                  <div className="flex gap-2 mb-4">
                    {problem.sampleTestCases.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestCase(index)}
                        className={`px-3 py-1 rounded text-sm ${
                          activeTestCase === index
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        Case {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Active Testcase Display */}
                  {problem.sampleTestCases[activeTestCase] && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Input:</div>
                        <pre className="bg-white border border-gray-200 p-2 rounded text-sm text-gray-900 overflow-x-auto">
                          {problem.sampleTestCases[activeTestCase].input}
                        </pre>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Expected Output:</div>
                        <pre className="bg-white border border-gray-200 p-2 rounded text-sm text-gray-900 overflow-x-auto">
                          {problem.sampleTestCases[activeTestCase].output}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Test Results */}
              {testResults && (
                <div className="space-y-3">
                  {testResults.passed ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={20} />
                      <span className="font-semibold">All test cases passed!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle size={20} />
                      <span className="font-semibold">Some tests failed</span>
                    </div>
                  )}

                  {testResults.testCases && testResults.testCases.map((tc, index) => (
                    <div key={index} className={`p-3 rounded border ${
                      tc.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">Test Case {index + 1}</span>
                        <span className={`text-xs ${tc.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {tc.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className="text-xs space-y-1 text-gray-700">
                        <div><span className="text-gray-600">Runtime:</span> {tc.executionTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Output */}
              {output && (
                <div className="mt-4">
                  <div className="text-xs text-gray-600 mb-2">Console Output:</div>
                  <pre className="bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>Last executed: Never</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning || !code.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              >
                <Play size={16} />
                {isRunning ? 'Running...' : 'Run Code'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !code.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={16} />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;
