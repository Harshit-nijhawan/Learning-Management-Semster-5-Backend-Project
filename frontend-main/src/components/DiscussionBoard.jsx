import React, { useState, useEffect } from "react";
import {
    MessageSquare, Heart, Share2, Search, Filter, Plus,
    ChevronUp, ChevronDown, Tag, Eye, Clock, User
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../utils/api";

function DiscussionBoard({ currentUser }) {
    const [view, setView] = useState("list"); // 'list' or 'detail' or 'create'
    const [discussions, setDiscussions] = useState([]);
    const [activeDiscussion, setActiveDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest"); // 'newest', 'hot'
    const [search, setSearch] = useState("");

    // Create Form State
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newTags, setNewTags] = useState("");

    // Comment Form State
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchDiscussions();
    }, [sortBy]);

    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/api/community?sort=${sortBy}&search=${search}`);
            setDiscussions(res.data);
        } catch (error) {
            console.error("Error fetching discussions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDiscussions();
    };

    const handleCreateDiscussion = async (e) => {
        e.preventDefault();
        try {
            if (!newTitle || !newContent) return;

            await api.post("/api/community", {
                title: newTitle,
                content: newContent,
                tags: newTags
            });

            setNewTitle("");
            setNewContent("");
            setNewTags("");
            setView("list");
            fetchDiscussions();
        } catch (error) {
            console.error("Error creating discussion:", error);
        }
    };

    const openDiscussion = async (discussion) => {
        setActiveDiscussion(discussion);
        setView("detail");
        try {
            // Fetch full details (increments view)
            const res = await api.get(`/api/community/${discussion._id}`);
            setActiveDiscussion(res.data);

            // Fetch comments
            const commentsRes = await api.get(`/api/community/${discussion._id}/comments`);
            setComments(commentsRes.data);
        } catch (error) {
            console.error("Error opening discussion:", error);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.post(`/api/community/${activeDiscussion._id}/comment`, {
                content: newComment
            });

            setNewComment("");
            // Refresh comments
            const commentsRes = await api.get(`/api/community/${activeDiscussion._id}/comments`);
            setComments(commentsRes.data);
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    const handleVote = async (id, type) => {
        try {
            const endpoint = type === 'discussion'
                ? `/api/community/${id}/vote`
                : `/api/community/comment/${id}/vote`;

            await api.put(endpoint);

            if (type === 'discussion') {
                // Optimistic update for list or detail
                if (view === 'list') fetchDiscussions();
                else {
                    const res = await api.get(`/api/community/${id}`);
                    setActiveDiscussion(res.data);
                }
            } else {
                // Refresh comments
                const commentsRes = await api.get(`/api/community/${activeDiscussion._id}/comments`);
                setComments(commentsRes.data);
            }

        } catch (error) {
            console.error("Vote failed", error);
        }
    };

    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">

            {/* Sidebar / List View */}
            <div className={`w-full ${view === 'list' ? 'block' : 'hidden md:block md:w-1/3'} border-r border-gray-200 bg-gray-50 flex flex-col`}>
                {/* Header */}
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Community</h2>
                        <button
                            onClick={() => setView('create')}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('newest')}
                            className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-colors ${sortBy === 'newest' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Newest
                        </button>
                        <button
                            onClick={() => setSortBy('hot')}
                            className={`flex-1 text-sm py-1.5 rounded-lg font-medium transition-colors ${sortBy === 'hot' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            Hot
                        </button>
                    </div>
                </div>

                {/* Discussion List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : discussions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No discussions yet. Start one!</div>
                    ) : (
                        discussions.map(discussion => (
                            <div
                                key={discussion._id}
                                onClick={() => openDiscussion(discussion)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors ${activeDiscussion?._id === discussion._id ? 'bg-white border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                            >
                                <h3 className={`font-semibold text-gray-800 mb-1 line-clamp-2 ${activeDiscussion?._id === discussion._id ? 'text-blue-700' : ''}`}>
                                    {discussion.title}
                                </h3>
                                <div className="flex gap-2 mb-2">
                                    {discussion.tags.slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">#{tag}</span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
                                            {discussion.author?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="truncate max-w-[80px]">{discussion.author?.name}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="flex items-center gap-1"><Heart size={12} /> {discussion.upvotes?.length || 0}</span>
                                        <span className="flex items-center gap-1"><MessageSquare size={12} /> {discussion.commentCount || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 bg-white flex flex-col ${view === 'list' ? 'hidden md:flex' : 'flex'}`}>

                {/* Detail View */}
                {view === 'detail' && activeDiscussion ? (
                    <>
                        <div className="bg-white border-b border-gray-100 p-6 flex-shrink-0">
                            <div className="flex items-center gap-2 mb-4">
                                <button onClick={() => setView('list')} className="md:hidden text-gray-500">← Back</button>
                                <div className="flex gap-2">
                                    {activeDiscussion.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeDiscussion.title}</h1>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                                        {activeDiscussion.author?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{activeDiscussion.author?.name}</p>
                                        <p className="text-gray-500 text-xs flex items-center gap-1">
                                            {formatDate(activeDiscussion.createdAt)} • <Eye size={12} /> {activeDiscussion.views} views
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleVote(activeDiscussion._id, 'discussion')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeDiscussion.upvotes?.includes(currentUser._id || currentUser.id) ? 'bg-red-50 text-red-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                    >
                                        <Heart size={18} fill={activeDiscussion.upvotes?.includes(currentUser._id || currentUser.id) ? "currentColor" : "none"} />
                                        <span className="font-bold">{activeDiscussion.upvotes?.length || 0}</span>
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-markdown">
                            <div className="prose prose-blue max-w-none text-gray-800">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {activeDiscussion.content}
                                </ReactMarkdown>
                            </div>

                            {/* Comments Section */}
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <MessageSquare size={20} className="text-blue-600" />
                                    Comments ({comments.length})
                                </h3>

                                <div className="space-y-6 mb-8">
                                    {comments.map(comment => (
                                        <div key={comment._id} className="flex gap-4 group">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm">
                                                    {comment.author?.name?.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-semibold text-sm text-gray-900">{comment.author?.name}</span>
                                                        <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                                                </div>
                                                <div className="flex gap-4 mt-1 ml-2">
                                                    <button
                                                        onClick={() => handleVote(comment._id, 'comment')}
                                                        className={`text-xs font-semibold flex items-center gap-1 ${comment.upvotes?.includes(currentUser._id || currentUser.id) ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        <Heart size={12} fill={comment.upvotes?.includes(currentUser._id || currentUser.id) ? "currentColor" : "none"} />
                                                        {comment.upvotes?.length || 0} Likes
                                                    </button>
                                                    <button className="text-xs font-semibold text-gray-500 hover:text-gray-700">Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Comment */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                                        {currentUser?.name?.charAt(0)}
                                    </div>
                                    <form onSubmit={handlePostComment} className="flex-1">
                                        <textarea
                                            className="w-full bg-white border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm"
                                            placeholder="Add to the discussion..."
                                            rows="3"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        ></textarea>
                                        <div className="flex justify-end mt-2">
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim()}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                ) : view === 'create' ? (
                    <div className="p-8 max-w-3xl mx-auto w-full">
                        <button onClick={() => setView('list')} className="md:hidden text-gray-500 mb-4">← Back</button>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Start a New Discussion</h2>
                        <form onSubmit={handleCreateDiscussion} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-semibold"
                                    placeholder="What's on your mind?"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="java, dsa, help..."
                                        value={newTags}
                                        onChange={(e) => setNewTags(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Content (Markdown Supported)</label>
                                <div className="relative">
                                    <textarea
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono text-sm"
                                        rows="12"
                                        placeholder="Write your post here... Use **bold**, `code`, or # headings."
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                    ></textarea>
                                    <span className="absolute bottom-4 right-4 text-xs text-gray-400">Markdown supported</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                                >
                                    Post Discussion
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                            <MessageSquare size={48} className="text-indigo-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Discussion</h2>
                        <p className="text-gray-500 max-w-sm mb-8">Choose a topic from the sidebar or start a new conversation to share your knowledge.</p>
                        <button
                            onClick={() => setView('create')}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25"
                        >
                            Start New Topic
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DiscussionBoard;
