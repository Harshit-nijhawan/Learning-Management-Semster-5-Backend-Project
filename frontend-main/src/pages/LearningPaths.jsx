import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, TrendingUp, Users, Award, Play, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const LearningPaths = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'DSA Complete',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'System Design',
    'Interview Preparation'
  ];

  const fetchPaths = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/api/paths', { params });
      setPaths(response.data.paths || response.data);
    } catch (error) {
      console.error('Error fetching paths:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const handleEnroll = async (pathId) => {
    try {
      await api.post(`/api/paths/${pathId}/enroll`);
      alert('Successfully enrolled in learning path!');
      fetchPaths(); // Refresh to show enrollment status
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Please login to enroll in learning paths');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: 'bg-green-100 text-green-700',
      Intermediate: 'bg-blue-100 text-blue-700',
      Advanced: 'bg-purple-100 text-purple-700',
      Expert: 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Learning Paths</h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Structured learning journeys designed to take you from beginner to expert
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search learning paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-gray-200 rounded mb-6"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No learning paths found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paths.map((path) => (
              <div
                key={path._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)} bg-white/90`}>
                      {path.difficulty}
                    </span>
                    {path.isFeatured && (
                      <Award className="w-6 h-6 text-yellow-300" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">
                    {path.title}
                  </h3>
                  <p className="text-purple-100 text-sm">{path.category}</p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {path.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs">Duration</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{path.estimatedDuration}h</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">Enrolled</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        {path.enrolledUsers?.length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Modules Info */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      What You'll Learn
                    </h4>
                    <ul className="space-y-2">
                      {path.learningOutcomes?.slice(0, 3).map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills Tags */}
                  {path.skills && path.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {path.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Modules Count */}
                  <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                    <span>{path.modules?.length || 0} Modules</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {path.totalLessons || 0} Lessons
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {path.enrolled ? (
                      <Link
                        to={`/paths/${path._id}`}
                        className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEnroll(path._id)}
                          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                          Enroll Now
                        </button>
                        <Link
                          to={`/paths/${path._id}`}
                          className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                        >
                          View
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {!loading && paths.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Choose a learning path that matches your goals and start building your skills today
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LearningPaths;
