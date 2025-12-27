import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, BookOpen, Tag, Heart, Bookmark, ThumbsUp } from 'lucide-react';
import api from '../utils/api';

function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('python');
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchArticle = useCallback(async () => {
    try {
      const response = await api.get(`/api/articles/${slug}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleLike = async () => {
    try {
      const response = await api.post(`/articles/${article._id}/like`);
      setHasLiked(response.data.hasLiked);
      setArticle(prev => ({ ...prev, likes: response.data.likes }));
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await api.post(`/articles/${article._id}/bookmark`);
      setIsBookmarked(response.data.isBookmarked);
    } catch (error) {
      console.error('Error bookmarking article:', error);
    }
  };

  const markAsCompleted = async () => {
    try {
      await api.post(`/articles/${article._id}/complete`, {
        timeSpent: 300 // Example: 5 minutes
      });
      alert('Article marked as completed!');
    } catch (error) {
      console.error('Error marking article as completed:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Article Not Found</h1>
          <p className="mt-4 text-gray-600">The article you're looking for doesn't exist.</p>
          <Link to="/articles" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded">
            Browse Articles
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {article.category}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {article.difficulty}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

            <div className="flex items-center gap-6 text-gray-600 text-sm mb-4">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{article.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{article.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={16} className={hasLiked ? 'fill-red-500 text-red-500' : ''} />
                <span>{article.likes} likes</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{article.description}</p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded ${hasLiked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Heart size={18} className={hasLiked ? 'fill-current' : ''} />
                {hasLiked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded ${isBookmarked ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              <button
                onClick={markAsCompleted}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <ThumbsUp size={18} />
                Mark as Completed
              </button>
            </div>
          </div>

          {/* Table of Contents */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Table of Contents</h2>
              <ul className="space-y-2">
                {article.tableOfContents.map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.anchor}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                      style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            {article.content && article.content.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 id={section.sectionTitle?.toLowerCase().replace(/\s+/g, '-')} className="text-2xl font-bold text-gray-900 mb-4">
                  {section.sectionTitle}
                </h2>

                {section.sectionType === 'text' && (
                  <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
      prose-headings:font-bold prose-headings:text-blue-800 
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-blue-900 prose-code:text-purple-600
      prose-li:marker:text-blue-500 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {cleanMarkdown(section.text)}
                    </ReactMarkdown>
                  </div>
                )}

                {section.sectionType === 'code' && section.code && (
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <div className="text-xs text-gray-400 mb-2">{section.code.language}</div>
                    <pre className="text-gray-100"><code>{section.code.snippet}</code></pre>
                    {section.code.output && (
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <div className="text-xs text-gray-400 mb-2">Output:</div>
                        <pre className="text-green-400"><code>{section.code.output}</code></pre>
                      </div>
                    )}
                  </div>
                )}

                {section.sectionType === 'note' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">{section.text}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Code Examples with Multiple Languages */}
          {article.codeExamples && article.codeExamples.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>

              {/* Language Tabs */}
              <div className="flex gap-2 mb-4 border-b">
                {article.codeExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(example.language)}
                    className={`px-4 py-2 font-medium ${activeTab === example.language
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {example.language.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Active Code */}
              {article.codeExamples.filter(ex => ex.language === activeTab).map((example, index) => (
                <div key={index}>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-gray-100"><code>{example.code}</code></pre>
                  </div>
                  {example.output && (
                    <div className="mt-4 bg-gray-100 rounded-lg p-4">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Output:</div>
                      <pre className="text-gray-800"><code>{example.output}</code></pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Complexity Analysis */}
          {article.complexity && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Complexity Analysis</h2>
              <div className="space-y-3">
                {article.complexity.time && (
                  <div>
                    <span className="font-semibold text-gray-700">Time Complexity: </span>
                    <span className="text-gray-600">{article.complexity.time}</span>
                  </div>
                )}
                {article.complexity.space && (
                  <div>
                    <span className="font-semibold text-gray-700">Space Complexity: </span>
                    <span className="text-gray-600">{article.complexity.space}</span>
                  </div>
                )}
                {article.complexity.explanation && (
                  <p className="text-gray-600 mt-2">{article.complexity.explanation}</p>
                )}
              </div>
            </div>
          )}

          {/* Key Points */}
          {article.keyPoints && article.keyPoints.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
              <ul className="space-y-2">
                {article.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {article.relatedArticles.map((related) => (
                  <Link
                    key={related._id}
                    to={`/articles/${related.slug}`}
                    className="block p-4 border rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{related.title}</h3>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded">{related.difficulty}</span>
                      <span>{related.readTime} min</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ArticlePage;
