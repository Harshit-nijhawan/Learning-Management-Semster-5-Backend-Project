import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Code, Play, RotateCcw, Trophy, Flame, CheckCircle, XCircle, Loader, Calendar } from 'lucide-react';
import api from '../utils/api';
import CodeEditor from '../components/CodeEditor';

const DailyQuestion = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchTodaysQuestion();
    fetchUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTodaysQuestion = async () => {
    try {
      const response = await api.get('/api/daily-question/today');
      const questionData = response.data.question;
      setQuestion(questionData);
      
      // Set starter code
      if (questionData.starterCode && questionData.starterCode[language]) {
        setCode(questionData.starterCode[language]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching daily question:', error);
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/api/daily-question/my-stats');
      setUserStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (question?.starterCode && question.starterCode[newLanguage]) {
      setCode(question.starterCode[newLanguage]);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      alert('Please write some code first!');
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await api.post('/api/daily-question/submit', {
        code,
        language
      });

      setResult(response.data.result);
      
      // Refresh stats if accepted
      if (response.data.result.status === 'accepted') {
        fetchUserStats();
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      setResult({
        status: 'error',
        message: error.response?.data?.message || 'Failed to submit code'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (question?.starterCode && question.starterCode[language]) {
      setCode(question.starterCode[language]);
    }
    setResult(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'wrong-answer':
        return <XCircle className="text-red-600" size={24} />;
      case 'runtime-error':
        return <XCircle className="text-orange-600" size={24} />;
      default:
        return <XCircle className="text-gray-600" size={24} />;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading today's challenge...</p>
          </div>
        </div>
      </>
    );
  }

  if (!question) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Question Available</h2>
            <p className="text-gray-600 mb-6">Check back tomorrow for a new challenge!</p>
            <button
              onClick={() => navigate('/problems')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Problems
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Stats Header */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Daily Coding Challenge</h1>
                <p className="text-sm text-gray-600">
                  {new Date(question.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              {userStats && (
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                      <Flame size={20} />
                      <span className="text-2xl font-bold">{userStats.currentStreak}</span>
                    </div>
                    <p className="text-xs text-gray-600">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                      <Trophy size={20} />
                      <span className="text-2xl font-bold">{userStats.solvedCount}</span>
                    </div>
                    <p className="text-xs text-gray-600">Solved</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                      <CheckCircle size={20} />
                      <span className="text-2xl font-bold">{userStats.maxStreak}</span>
                    </div>
                    <p className="text-xs text-gray-600">Max Streak</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Question */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{question.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className="text-sm text-gray-600">
                        Acceptance: {question.acceptanceRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'description'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('examples')}
                      className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'examples'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Examples
                    </button>
                    <button
                      onClick={() => setActiveTab('hints')}
                      className={`pb-3 px-1 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'hints'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Hints
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                  {activeTab === 'description' && (
                    <div>
                      <div className="prose prose-sm max-w-none mb-6">
                        <p className="text-gray-700 whitespace-pre-wrap">{question.description}</p>
                      </div>
                      
                      {question.constraints && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-gray-900 mb-2">Constraints:</h3>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{question.constraints}</p>
                        </div>
                      )}

                      {question.tags && question.tags.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-gray-900 mb-2">Tags:</h3>
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'examples' && (
                    <div className="space-y-4">
                      {question.examples && question.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-semibold text-gray-900 mb-2">Example {index + 1}:</p>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-semibold text-gray-700">Input:</span>
                              <pre className="mt-1 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                                {example.input}
                              </pre>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Output:</span>
                              <pre className="mt-1 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                                {example.output}
                              </pre>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="font-semibold text-gray-700">Explanation:</span>
                                <p className="mt-1 text-gray-600">{example.explanation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'hints' && (
                    <div className="space-y-3">
                      {question.hints && question.hints.length > 0 ? (
                        question.hints.map((hint, index) => (
                          <div key={index} className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Hint {index + 1}:</span> {hint}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-sm">No hints available for this problem.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Code Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code className="text-blue-600" size={20} />
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python" disabled>Python (Coming Soon)</option>
                    <option value="java" disabled>Java (Coming Soon)</option>
                    <option value="cpp" disabled>C++ (Coming Soon)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={submitting}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                  <button
                    onClick={handleRunCode}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader className="animate-spin" size={16} />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Run Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <CodeEditor
                  code={code}
                  setCode={setCode}
                  language={language}
                />
              </div>

              {/* Results Panel */}
              {result && (
                <div className="p-4 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {result.status === 'accepted' ? 'Accepted' : 
                           result.status === 'wrong-answer' ? 'Wrong Answer' :
                           result.status === 'runtime-error' ? 'Runtime Error' : 'Error'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.passedTests}/{result.totalTests} test cases passed
                        </p>
                      </div>
                    </div>

                    {result.runtime && (
                      <p className="text-sm text-gray-600 mb-3">
                        Runtime: {result.runtime}ms
                      </p>
                    )}

                    {result.message && (
                      <p className="text-sm text-gray-700 mb-3">{result.message}</p>
                    )}

                    {/* Test Results */}
                    {result.testResults && result.testResults.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-gray-900">Test Results:</h4>
                        {result.testResults.filter(tr => !tr.isHidden).map((testResult, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg text-sm ${
                              testResult.passed 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {testResult.passed ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : (
                                <XCircle size={16} className="text-red-600" />
                              )}
                              <span className="font-semibold">
                                Test Case {testResult.testNumber}
                              </span>
                            </div>
                            <div className="ml-6 space-y-1 text-xs">
                              <div>
                                <span className="font-semibold">Input:</span> {testResult.input}
                              </div>
                              <div>
                                <span className="font-semibold">Expected:</span> {testResult.expectedOutput}
                              </div>
                              {!testResult.passed && (
                                <div className="text-red-700">
                                  <span className="font-semibold">Got:</span> {testResult.actualOutput}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyQuestion;
