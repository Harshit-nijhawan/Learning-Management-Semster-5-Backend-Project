import React, { useState, useEffect } from "react";

export default function YoutubeVideos() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("mathematics");

  const API_KEY = "AIzaSyBCvrAqbcEI_6ukYZJg47Bf7yEPL70tP5g";

  // Fetch YouTube videos
  const fetchVideos = async (query) => {
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

  // Fetch initial videos
  useEffect(() => {
    fetchVideos(searchTerm);
  }, []);

  // Handle form submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(searchTerm);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📚 YouTube Learning Videos</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          placeholder="Search for videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border p-2 rounded-l-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r-lg"
        >
          Search
        </button>
      </form>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div key={video.id.videoId} className="shadow-md p-2 rounded-lg border">
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="rounded-lg w-full"
              />
              <h2 className="font-semibold text-sm mt-2">
                {video.snippet.title}
              </h2>
              <p className="text-xs text-gray-600">{video.snippet.channelTitle}</p>
            </a>
          </div>
        ))}
      </div>
    </div>

  );
}
