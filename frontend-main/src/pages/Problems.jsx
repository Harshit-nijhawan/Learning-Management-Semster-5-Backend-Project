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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Code className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Practice Problems</h1>
            </div>
            <p className="text-xl text-green-100 mb-6">
              Solve coding challenges and improve your problem-solving skills
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold">{stats.solved}</div>
                <div className="text-sm text-green-100">Solved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-green-100">Total Problems</div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative shadow-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search problems by title, tags, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 border-2 border-transparent hover:border-green-300 transition-all"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Difficulty Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Filter className="w-5 h-5 text-gray-600 flex-shrink-0" />
            {difficulties.map((diff) => (
              <button
                key={diff.name}
                onClick={() => {
                  setSelectedDifficulty(diff.name);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-all ${
                  selectedDifficulty === diff.name
                    ? 'bg-green-600 text-white shadow-md'
                    : `${diff.color} hover:bg-gray-100`
                }`}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Category Filter */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                      selectedCategory === category
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Problems Table */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm">
                  <div className="col-span-1">Status</div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Difficulty</div>
                  <div className="col-span-2 text-center">Acceptance</div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="px-6 py-4 animate-pulse">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-1">
                          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="col-span-5">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div className="col-span-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="col-span-2">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="col-span-2">
                          <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : problems.length === 0 ? (
                <div className="text-center py-12">
                  <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <>
                  {/* Problems List */}
                  <div className="divide-y">
                    {problems.map((problem, idx) => (
                      <Link
                        key={problem._id}
                        to={`/problems/${problem.slug}`}
                        className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Status */}
                          <div className="col-span-1">
                            {problem.solved ? (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                            )}
                          </div>

                          {/* Title */}
                          <div className="col-span-5">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-sm">{idx + 1 + (currentPage - 1) * 20}.</span>
                              <span className="font-medium text-gray-900 hover:text-green-600">
                                {problem.title}
                              </span>
                              {problem.isFeatured && (
                                <Trophy className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            {/* Company Tags */}
                            {problem.companies && problem.companies.length > 0 && (
                              <div className="flex gap-2 mt-1">
                                {problem.companies.slice(0, 3).map((company, i) => (
                                  <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                    {company}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Category */}
                          <div className="col-span-2">
                            <span className="text-sm text-gray-600">{problem.category}</span>
                          </div>

                          {/* Difficulty */}
                          <div className="col-span-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </div>

                          {/* Acceptance Rate */}
                          <div className="col-span-2 text-center">
                            {problem.stats && problem.stats.totalSubmissions > 0 ? (
                              <span className="text-sm text-gray-600">
                                {Math.round((problem.stats.successfulSubmissions / problem.stats.totalSubmissions) * 100)}%
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t bg-gray-50">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        <div className="flex gap-2">
                          {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                            const pageNum = idx + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-4 py-2 rounded-md ${
                                  currentPage === pageNum
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Problems;
