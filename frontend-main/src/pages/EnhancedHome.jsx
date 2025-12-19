import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Code, BookOpen, TrendingUp, Award, Users, 
  Zap, Target, ChevronRight, Star, Clock, Trophy
} from "lucide-react";
import api from "../utils/api";

export default function EnhancedHome() {
  const navigate = useNavigate();
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [featuredProblems, setFeaturedProblems] = useState([]);
  const [stats, setStats] = useState({ users: 0, problems: 0, articles: 0 });

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      const [articlesRes, problemsRes] = await Promise.all([
        api.get('/api/articles?limit=3&isFeatured=true'),
        api.get('/api/problems?limit=3&isFeatured=true')
      ]);
      
      setFeaturedArticles(articlesRes.data.articles || articlesRes.data || []);
      setFeaturedProblems(problemsRes.data.problems || problemsRes.data || []);
      
      setStats({
        users: 1200,
        problems: problemsRes.data.total || 50,
        articles: articlesRes.data.total || 100
      });
    } catch (error) {
      console.error('Error fetching featured content:', error);
    }
  };

  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-blue-600" />,
      title: "Learn Concepts",
      desc: "Comprehensive articles and tutorials on programming topics",
      color: "bg-blue-50 border-blue-200",
      link: "/articles"
    },
    {
      icon: <Code className="w-12 h-12 text-green-600" />,
      title: "Solve Problems",
      desc: "Practice coding challenges from easy to advanced level",
      color: "bg-green-50 border-green-200",
      link: "/problems"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-600" />,
      title: "Learning Paths",
      desc: "Structured learning journeys for systematic skill building",
      color: "bg-purple-50 border-purple-200",
      link: "/paths"
    },
    {
      icon: <Trophy className="w-12 h-12 text-yellow-600" />,
      title: "Track Progress",
      desc: "Monitor your growth with streaks, points, and achievements",
      color: "bg-yellow-50 border-yellow-200",
      link: "/dashboard"
    }
  ];

  const categories = [
    { name: "Data Structures", icon: "📊", count: 45, color: "from-blue-500 to-cyan-500" },
    { name: "Algorithms", icon: "🔍", count: 38, color: "from-green-500 to-teal-500" },
    { name: "Web Development", icon: "🌐", count: 52, color: "from-purple-500 to-pink-500" },
    { name: "Python", icon: "🐍", count: 41, color: "from-yellow-500 to-orange-500" },
    { name: "Java", icon: "☕", count: 35, color: "from-red-500 to-pink-500" },
    { name: "System Design", icon: "🏗️", count: 28, color: "from-indigo-500 to-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">India's Leading Learning Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Master Programming
                <span className="block text-blue-200">Step by Step</span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Learn DSA, solve problems, and prepare for tech interviews with our comprehensive platform. 
                Join thousands of developers improving their coding skills.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/problems')}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  Start Practicing <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate('/articles')}
                  className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-200"
                >
                  Explore Articles
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold">{stats.users}+</div>
                  <div className="text-blue-200 text-sm">Active Learners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.problems}+</div>
                  <div className="text-blue-200 text-sm">Problems</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.articles}+</div>
                  <div className="text-blue-200 text-sm">Articles</div>
                </div>
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-blue-200">Problem Solved</div>
                        <div className="font-semibold">Two Sum - Easy</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-blue-200">Achievement Unlocked</div>
                        <div className="font-semibold">7 Day Streak!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Learnify?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to become a better programmer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onClick={() => navigate(feature.link)}
                className={`${feature.color} border-2 rounded-xl p-6 cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.desc}</p>
                <div className="flex items-center text-blue-600 font-semibold">
                  Get Started <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-xl text-gray-600">Choose your learning path</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/articles?category=${cat.name}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className={`h-2 bg-gradient-to-r ${cat.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{cat.icon}</span>
                    <span className="text-sm text-gray-500">{cat.count} topics</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center text-blue-600 font-medium">
                    Start Learning <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Articles</h2>
                <p className="text-gray-600">Start your learning journey</p>
              </div>
              <Link to="/articles" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link
                  key={article._id}
                  to={`/articles/${article.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime || 5} min
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {article.likes || 0}
                      </span>
                      <span>{article.views || 0} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Problems */}
      {featuredProblems.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Popular Problems</h2>
                <p className="text-gray-600">Test your skills</p>
              </div>
              <Link to="/problems" className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-2">
                View All <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProblems.map((problem) => (
                <Link
                  key={problem._id}
                  to={`/problems/${problem.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <Code className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {problem.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {problem.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {problem.points || 10} points
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of developers who are mastering programming concepts and acing technical interviews
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => navigate('/problems')}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-200"
            >
              Browse Problems
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
