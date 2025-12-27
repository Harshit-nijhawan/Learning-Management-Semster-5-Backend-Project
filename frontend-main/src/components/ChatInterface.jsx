import React, { useState, useEffect, useRef } from "react";
import { Send, Search, User, MoreVertical, Phone, Video } from "lucide-react";
import api from "../utils/api";

function ChatInterface({ currentUser }) {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch conversations/contacts on mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Poll for new messages every 3 seconds if a user is selected
    useEffect(() => {
        let interval;
        if (selectedUser) {
            fetchMessages(selectedUser._id); // Initial fetch
            interval = setInterval(() => {
                fetchMessages(selectedUser._id);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [selectedUser]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            setLoading(true);
            // First try to get existing conversations
            const convRes = await api.get("/api/chat/conversations");

            // Also get potential contacts (directory) to populate the list if empty or to show more people
            const contactRes = await api.get("/api/chat/contacts");

            // Merge unique users. prioritizing those with conversations
            const convIds = new Set(convRes.data.map(c => c._id));
            const merged = [...convRes.data];

            contactRes.data.forEach(contact => {
                if (!convIds.has(contact._id)) {
                    merged.push({ ...contact, lastMessage: null }); // Add as contact without history
                }
            });

            setConversations(merged);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await api.get(`/api/chat/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const payload = {
                receiverId: selectedUser._id,
                content: newMessage
            };

            // Optimistic update
            const tempMsg = {
                _id: Date.now(),
                sender: currentUser._id || currentUser.id,
                content: newMessage,
                createdAt: new Date().toISOString(),
                pending: true
            };
            setMessages(prev => [...prev, tempMsg]);
            setNewMessage("");

            await api.post("/api/chat/send", payload);

            // Refresh to get actual server state (timestamp, id, etc)
            fetchMessages(selectedUser._id);
            fetchConversations(); // Update last message in sidebar
        } catch (error) {
            console.error("Error sending message:", error);
            // Could show error toast here
        }
    };

    const filteredConversations = conversations.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sidebar - User List */}
            <div className={`w-full md:w-80 border-r border-gray-200 bg-gray-50 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search people..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map(user => (
                        <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-white transition-colors border-b border-gray-100 last:border-0 ${selectedUser?._id === user._id ? "bg-white border-l-4 border-l-blue-600 shadow-sm" : "border-l-4 border-l-transparent"
                                }`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                {/* Online indicator mock - could be real if socket used */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`font-semibold truncate ${selectedUser?._id === user._id ? 'text-blue-700' : 'text-gray-800'}`}>
                                        {user.name}
                                    </h3>
                                    {user.lastMessageTime && (
                                        <span className="text-xs text-gray-400">
                                            {new Date(user.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {user.lastMessage || <span className="italic opacity-70">Start a conversation</span>}
                                </p>
                            </div>
                        </div>
                    ))}

                    {loading && conversations.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Loading contacts...
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col bg-slate-50 relative">
                    {/* Header */}
                    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
                            >
                                ←
                            </button>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{selectedUser.name}</h3>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <Phone className="hover:text-blue-600 cursor-pointer transition-colors" size={20} />
                            <Video className="hover:text-blue-600 cursor-pointer transition-colors" size={20} />
                            <MoreVertical className="hover:text-gray-600 cursor-pointer" size={20} />
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender === (currentUser._id || currentUser.id);
                            return (
                                <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${isMe
                                            ? "bg-blue-600 text-white rounded-tr-none"
                                            : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <div className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                                            {msg.pending ? "Sending..." : new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-100 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all outline-none"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 text-center p-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <User size={40} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Conversation</h2>
                    <p className="text-gray-500 max-w-sm">Choose a contact from the list to start messaging or search for someone new.</p>
                </div>
            )}
        </div>
    );
}

export default ChatInterface;
