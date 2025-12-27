import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Code, Trophy, BookmarkPlus, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, solved: 0 });

  const categories = [
    'All',
    'Array',
    'String',
    'Linked List',
    'Stack',
    'Queue',
    'Tree',
    'Graph',
    'Dynamic Programming',
    'Greedy',
    'Backtracking',
    'Divide and Conquer',
    'Sorting',
    'Searching',
    'Recursion',
    'Mathematical',
    'Bit Manipulation'
  ];

  const difficulties = [
    { name: 'All', color: 'text-gray-700' },
    { name: 'School', color: 'text-green-600' },
    { name: 'Basic', color: 'text-blue-600' },
    { name: 'Easy', color: 'text-teal-600' },
    { name: 'Medium', color: 'text-yellow-600' },
    { name: 'Hard', color: 'text-orange-600' }
  ];

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20
      };

      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/api/problems', { params });
      setProblems(response.data.problems || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty, currentPage, searchTerm]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/api/progress/stats');
      setStats({
        total: problems.length,
        solved: response.data.problemsSolved?.length || 0
      });
    } catch {
      console.log('Stats not available');
    }
  }, [problems.length]);

  useEffect(() => {
    fetchProblems();
    fetchStats();
  }, [fetchProblems, fetchStats]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProblems();
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      School: 'bg-green-50 text-green-700 border-green-200',
      Basic: 'bg-blue-50 text-blue-700 border-blue-200',
      Easy: 'bg-teal-50 text-teal-700 border-teal-200',
      Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Hard: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[difficulty] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <Navbar />

      {/* Header Section */}
      <div className="relative overflow-hidden bg-slate-900 py-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl rounded-full"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-500/20 to-teal-500/20 blur-3xl rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-2xl ring-1 ring-white/20">
            <Code className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Practice Problems
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Master your coding skills with our curated collection of challenges.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-md rounded-xl px-8 py-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl font-bold text-emerald-400 mb-1">{stats.solved}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Solved</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl px-8 py-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-4xl font-bold text-blue-400 mb-1">{stats.total}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Problems</div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2 ring-1 ring-gray-900/5">
              <Search className="ml-4 text-slate-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search problems by title, tags, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-lg"
              />
              <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Difficulty Tabs - Modern Pill Design */}
        <div className="flex overflow-x-auto pb-4 gap-3 mb-8 no-scrollbar">
          {difficulties.map((diff) => (
            <button
              key={diff.name}
              onClick={() => {
                setSelectedDifficulty(diff.name);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 border ${selectedDifficulty === diff.name
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              {/* Optional: Add icons based on diff */}
              {selectedDifficulty === diff.name && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>}
              {diff.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Category Filter */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                <BookmarkPlus className="w-5 h-5 text-indigo-500" />
                Categories
              </h2>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`nav-item w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium flex items-center justify-between ${selectedCategory === category
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' // Active state
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' // Inactive state
                      }`}
                  >
                    {category}
                    {selectedCategory === category && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Problems List */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 backdrop-blur-sm">
                <div className="grid grid-cols-12 gap-6 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-6">Problem</div>
                  <div className="col-span-2">Difficulty</div>
                  <div className="col-span-3 text-right">Acceptance</div>
                </div>
              </div>

              {/* Loading State Skeleton */}
              {loading ? (
                <div className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="px-6 py-5 animate-pulse">
                      <div className="grid grid-cols-12 gap-6 items-center">
                        <div className="col-span-1 flex justify-center"><div className="h-4 w-4 bg-slate-200 rounded-full"></div></div>
                        <div className="col-span-6"><div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-slate-100 rounded w-1/4"></div></div>
                        <div className="col-span-2"><div className="h-6 bg-slate-200 rounded-full w-20"></div></div>
                        <div className="col-span-3"><div className="h-4 bg-slate-200 rounded w-10 ml-auto"></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : problems.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6 ring-1 ring-slate-100">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No problems found</h3>
                  <p className="text-slate-500">We couldn't find any problems matching your criteria.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {problems.map((problem) => (
                    <Link
                      key={problem._id}
                      to={`/problems/${problem.slug}`}
                      className="group block px-6 py-5 hover:bg-slate-50/80 transition-all duration-200 relative"
                    >
                      {/* Hover Indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="grid grid-cols-12 gap-6 items-center">
                        {/* Status Icon */}
                        <div className="col-span-1 flex justify-center">
                          {problem.solved ? (
                            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center ring-4 ring-emerald-50">
                              <svg className="w-3.5 h-3.5" fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>
                            </div>
                          ) : (
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                          )}
                        </div>

                        {/* Title & Meta */}
                        <div className="col-span-6">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 flex items-center gap-2">
                            {problem.title}
                            {problem.isFeatured && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Featured</span>}
                          </h3>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                              {problem.category}
                            </span>
                            {problem.companies && problem.companies.length > 0 && (
                              <span className="text-slate-400 truncate max-w-[200px]">
                                Asked by {problem.companies.slice(0, 2).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Difficulty Badge */}
                        <div className="col-span-2">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                problem.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                            {problem.difficulty}
                          </span>
                        </div>

                        {/* Acceptance Rate */}
                        <div className="col-span-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-700">
                              {problem.stats && problem.stats.totalSubmissions > 0 ? (
                                Math.round((problem.stats.successfulSubmissions / problem.stats.totalSubmissions) * 100) + '%'
                              ) : 'N/A'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Acceptance</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls - Simplified and Modern */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex shadow-sm rounded-lg bg-white p-1 ring-1 ring-slate-200">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 text-sm font-medium text-slate-900 border-l border-r border-slate-100 flex items-center">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Problems;
