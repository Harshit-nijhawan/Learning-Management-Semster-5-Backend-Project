import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { PlayCircle, FileText, BookOpen, ArrowLeft } from "lucide-react";

function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Robust helper to get a working YouTube Embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";

    // 1. Handle raw iframe code pasted by instructor
    if (url.includes("<iframe")) {
        const match = url.match(/src="([^"]+)"/);
        if (match && match[1]) return match[1];
    }

    try {
      let videoId = "";
      // 2. Handle standard watch URL
      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      }
      // 3. Handle shortened URL
      else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      }
      // 4. Handle already embedded
      else {
        return url; 
      }
      // Return correct embed format
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch (e) {
      return url; 
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Prevent fetching if ID is garbage (like HTML)
        if (!id || id.includes("<")) {
             console.error("Invalid Course ID in URL");
             navigate("/dashboard");
             return;
        }

        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        if (res.data.curriculum && res.data.curriculum.length > 0) {
          setActiveChapter(res.data.curriculum[0]);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!course)
    return (
      <div className="text-center mt-20 text-xl font-bold text-gray-700">
        Course Not Found
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden mt-[60px] lg:mt-0">
        {/* MAIN CONTENT AREA (Left) */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Video Player Section */}
          <div className="bg-black w-full aspect-video shrink-0 shadow-lg relative">
            {activeChapter?.videoLink ? (
              <iframe
                src={getEmbedUrl(activeChapter.videoLink)}
                className="w-full h-full"
                title="Course Video"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900">
                <PlayCircle size={48} className="mb-2 opacity-50" />
                <p>Select a chapter to begin learning</p>
              </div>
            )}
          </div>

          {/* Reading Content Section */}
          <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {activeChapter?.chapterTitle || course.title}
              </h2>
            </div>

            {activeChapter?.content ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
                  <BookOpen size={24} /> Reading Material & Notes
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
                  {activeChapter.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No reading material added for this lesson.</p>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR CURRICULUM (Right) */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 h-[50vh] lg:h-auto overflow-hidden">
          <div className="p-5 bg-gray-900 text-white border-b border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Course Content</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {course.curriculum?.length || 0} Chapters
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.curriculum?.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setActiveChapter(chapter)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-blue-50 transition flex gap-3 group ${
                  activeChapter?._id === chapter._id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="mt-0.5">
                  {activeChapter?._id === chapter._id ? (
                    <PlayCircle
                      size={20}
                      className="text-blue-600 fill-blue-100"
                    />
                  ) : (
                    <span className="text-xs font-bold text-gray-500 w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full group-hover:border-blue-400 group-hover:text-blue-500">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`text-sm font-medium leading-snug ${
                      activeChapter?._id === chapter._id
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {chapter.chapterTitle}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;