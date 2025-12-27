import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Trophy, Flame, CheckCircle, Loader, Calendar, Youtube, BookOpen, Play, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const DailyQuestion = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
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
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />

      {/* Hero Section / Header */}
      <div className="bg-gray-900 pt-10 pb-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 p-20 bg-purple-500 rounded-full blur-[100px] opacity-10"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold uppercase tracking-wider text-xs">
                <Calendar size={14} />
                <span>Daily Coding Challenge</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
                {new Date(question.date).toLocaleDateString('en-US', { weekday: 'long' })}, <span className="text-gray-400">{new Date(question.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </h1>
              <p className="text-gray-400 max-w-xl">Keep your streak alive by solving a new problem every day. Consistency is the key to mastery.</p>
            </div>

            {userStats && (
              <div className="flex gap-4 bg-gray-800/50 p-4 rounded-2xl backdrop-blur-sm border border-gray-700">
                <div className="text-center px-4 border-r border-gray-700 last:border-0">
                  <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                    <Flame size={20} fill="currentColor" /> {userStats.currentStreak}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-1">Day Streak</div>
                </div>
                <div className="text-center px-4 border-r border-gray-700 last:border-0">
                  <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-1">
                    <CheckCircle size={20} /> {userStats.solvedCount}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-1">Problems Solved</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-2xl font-bold text-green-500 flex items-center justify-center gap-1">
                    <Trophy size={20} /> {userStats.maxStreak}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-1">Max Streak</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Card - Floating up */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 mb-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

          {/* Left Panel: Problem Statement */}
          <div className="flex-1 p-8 md:p-10 border-r border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{question.title}</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${question.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                    question.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {question.difficulty}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    Acceptance: <span className="text-gray-800">{question.acceptanceRate}%</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/problems/${question.slug}/solve`)}
                className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95">
                <span>Solve Problem</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-8">
              {['description', 'examples', 'hints'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-6 font-bold text-sm transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                </button>
              ))}
              <button
                onClick={() => setActiveTab('solution')}
                className={`pb-4 px-6 font-bold text-sm transition-all relative flex items-center gap-2 ${activeTab === 'solution' ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'
                  }`}
              >
                <Youtube size={16} /> Solution
                {activeTab === 'solution' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full"></div>}
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="prose prose-slate max-w-none text-gray-600">
              {activeTab === 'description' && (
                <div className="animate-fade-in">
                  <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8 text-blue-900 font-medium leading-relaxed">
                    {question.description}
                  </div>

                  {question.constraints && (
                    <div className="mb-8">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle size={18} className="text-gray-400" /> Constraints
                      </h4>
                      <ul className="bg-gray-50 rounded-xl p-5 list-none m-0 border border-gray-100 space-y-2">
                        {question.constraints.split('\n').map((c, i) => (
                          <li key={i} className="flex gap-3 text-sm font-mono text-gray-700">
                            <span className="text-gray-300 select-none">•</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                    {question.tags?.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-default">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div className="space-y-6 animate-fade-in">
                  {question.examples?.map((ex, i) => (
                    <div key={i} className="group">
                      <h4 className="text-gray-900 font-bold mb-3">Example {i + 1}</h4>
                      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden text-sm">
                        <div className="p-4 border-b border-gray-100 grid grid-cols-[80px_1fr] gap-4">
                          <span className="font-bold text-gray-500 uppercase text-xs tracking-wider pt-1">Input</span>
                          <code className="font-mono text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 w-fit">{ex.input}</code>
                        </div>
                        <div className="p-4 grid grid-cols-[80px_1fr] gap-4 bg-white">
                          <span className="font-bold text-gray-500 uppercase text-xs tracking-wider pt-1">Output</span>
                          <code className="font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-200 w-fit">{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className="p-4 bg-yellow-50/50 border-t border-yellow-100 text-yellow-800 italic">
                            <span className="font-bold not-italic text-yellow-900 mr-2">Explanation:</span>
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'hints' && (
                <div className="space-y-4 animate-fade-in">
                  {question.hints && question.hints.length > 0 ? (
                    question.hints.map((hint, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 text-sm">
                          {i + 1}
                        </div>
                        <p className="m-0 leading-relaxed font-medium">{hint}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-400 font-medium">No hints available for this activeTab.</div>
                  )}
                </div>
              )}

              {activeTab === 'solution' && (
                <div className="animate-fade-in">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-8 relative group">
                    {question.videoUrl ? (
                      <iframe
                        src={getYouTubeEmbedUrl(question.videoUrl)}
                        title="Solution Video"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                        <Youtube size={48} className="opacity-20" />
                        <p>Video solution not available</p>
                      </div>
                    )}
                  </div>
                  {question.theory && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen size={24} className="text-blue-600" /> Approach Details
                      </h3>
                      <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{question.theory}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Call to Action / Stats (Desktop Only) */}
          <div className="hidden md:flex w-80 bg-gray-50 flex-col p-8 border-l border-gray-100">
            <div className="sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4">Your Progress</h3>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span className="text-sm font-bold text-orange-500">Not Solved</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-orange-500 h-2 rounded-full w-[10%]"></div>
                </div>
                <p className="text-xs text-center text-gray-400">Complete today's challenge to build your streak!</p>
              </div>

              <button
                onClick={() => navigate(`/problems/${question.slug}/solve`)}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 mb-4">
                Start Coding
              </button>
              <button
                onClick={() => navigate('/problems')}
                className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                View All Problems
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestion;
