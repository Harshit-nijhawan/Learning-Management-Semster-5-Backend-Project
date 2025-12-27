import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, TrendingUp, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'All',
    'Data Structures',
    'Algorithms',
    'Web Development',
    'Python',
    'Java',
    'JavaScript',
    'C++',
    'Database',
    'System Design',
    'Machine Learning',
    'Interview Preparation',
    'Competitive Programming'
  ];

  const difficulties = ['All', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12
      };

      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/api/articles', { params });
      setArticles(response.data.articles || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty, currentPage, searchTerm]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticles();
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: 'bg-green-100 text-green-800',
      Easy: 'bg-blue-100 text-blue-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-orange-100 text-orange-800',
      Expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <Navbar />

      {/* Header Section - Consistent with Problems page */}
      <div className="relative overflow-hidden bg-slate-900 py-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl rounded-full"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-500/20 to-teal-500/20 blur-3xl rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-2xl ring-1 ring-white/20">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Learn Through Articles
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Comprehensive tutorials and guides to master programming concepts.
          </p>

          {/* Search Bar - Glassmorphism */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group z-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2 ring-1 ring-gray-900/5">
              <Search className="ml-4 text-slate-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search articles by title, tags, or category..."
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <Filter className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => {
                        setSelectedDifficulty(difficulty);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedDifficulty === difficulty
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Category</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between group ${selectedCategory === category
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                      {category}
                      {selectedCategory === category && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
                </h2>
                <p className="text-slate-500 mt-1">
                  Showing {articles.length} article{articles.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                    <div className="h-20 bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
                <p className="text-slate-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <Link
                      key={article._id}
                      to={`/articles/${article.slug}`}
                      className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Tags Header */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wide">
                            {article.subcategory || article.category}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${article.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              article.difficulty === 'Easy' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                article.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                  'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                            {article.difficulty}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                          {article.description}
                        </p>

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                            {article.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{article.readTime || 5} min read</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                              <span>{article.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                              <span>{article.likes || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
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
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Articles;
