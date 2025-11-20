import React, { useState, useEffect } from "react";

export default function YoutubeVideos() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("mathematics");

  // FIX: Use environment variable
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const fetchVideos = async (query) => {
    if (!API_KEY) {
      console.error("YouTube API Key is missing!");
      return;
    }
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${API_KEY}`
      );
      const data = await res.json();
      setVideos(data.items || []);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos(searchTerm);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchTerm);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📚 YouTube Learning Videos</h1>
      
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          placeholder="Search for videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border p-2 rounded-l-lg outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.length > 0 ? videos.map((video) => (
          <div key={video.id.videoId} className="shadow-md p-2 rounded-lg border bg-white hover:shadow-lg transition">
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="rounded-lg w-full h-48 object-cover"
              />
              <h2 className="font-semibold text-sm mt-2 line-clamp-2">
                {video.snippet.title}
              </h2>
              <p className="text-xs text-gray-600 mt-1">{video.snippet.channelTitle}</p>
            </a>
          </div>
        )) : (
            <p className="col-span-full text-center text-gray-500">No videos found or API limit reached.</p>
        )}
      </div>
    </div>
  );
}