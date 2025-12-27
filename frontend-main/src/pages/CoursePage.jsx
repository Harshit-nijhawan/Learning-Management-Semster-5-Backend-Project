import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { PlayCircle, FileText, BookOpen, ArrowLeft, Video } from "lucide-react";

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

        const res = await api.get(`/api/courses/${id}`);
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
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden mt-[60px] lg:mt-0">

        {/* MAIN CONTENT AREA (Left) */}
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">

          {/* Header Breadcrumb */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2 sticky top-0 z-10 shadow-sm">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none truncate max-w-xl">{course.title}</h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">COURSE</span>
                <span>•</span>
                <span>{activeChapter?.chapterTitle || "Introduction"}</span>
              </p>
            </div>
          </div>

          {/* Video Player Section */}
          <div className="bg-black w-full shadow-2xl relative group">
            <div className="aspect-video w-full max-h-[70vh] mx-auto bg-black">
              {activeChapter?.videoLink ? (
                <iframe
                  src={getEmbedUrl(activeChapter.videoLink)}
                  className="w-full h-full"
                  title="Course Video"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-900/50 backdrop-blur-sm">
                  <PlayCircle size={64} className="mb-4 opacity-30" />
                  <p className="font-medium text-lg">Select a chapter to begin learning</p>
                </div>
              )}
            </div>
          </div>

          {/* Reading Content Section */}
          <div className="flex-1 bg-gray-50">
            <div className="max-w-5xl mx-auto w-full p-6 lg:p-12">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200 text-blue-600">
                  <FileText size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {activeChapter?.chapterTitle || "Select a Chapter"}
                  </h2>
                  <p className="text-gray-500">Reading Material & Notes</p>
                </div>
              </div>

              {activeChapter?.content ? (
                <article className="bg-white p-8 lg:p-12 rounded-2xl shadow-sm border border-gray-200 prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-h2:text-blue-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-img:rounded-xl">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {activeChapter.content}
                  </div>
                </article>
              ) : (
                <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No reading material available for this lesson.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR CURRICULUM (Right) */}
        <div className="w-full lg:w-[400px] bg-white border-l border-gray-200 flex flex-col shrink-0 h-[40vh] lg:h-auto overflow-hidden shadow-xl z-20">
          <div className="p-6 bg-gray-900 text-white flex justify-between items-end shadow-md">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Course Content</p>
              <h3 className="font-bold text-xl">{course.curriculum?.length || 0} Lessons</h3>
            </div>
            <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold border border-gray-700">
              {Math.round(((course.curriculum?.indexOf(activeChapter) + 1) / course.curriculum?.length) * 100) || 0}%
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50">
            {course.curriculum?.map((chapter, index) => {
              const isActive = activeChapter?._id === chapter._id;
              return (
                <button
                  key={index}
                  onClick={() => setActiveChapter(chapter)}
                  className={`w-full text-left p-4 border-b border-gray-100 transition-all duration-200 flex gap-4 group hover:bg-white ${isActive
                    ? "bg-white border-l-4 border-l-blue-600 shadow-sm"
                    : "border-l-4 border-l-transparent opacity-80 hover:opacity-100"
                    }`}
                >
                  <div className="mt-1 shrink-0">
                    {isActive ? (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                        <PlayCircle size={14} className="text-white" fill="white" />
                      </div>
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs font-bold text-gray-500 bg-white group-hover:border-blue-400 group-hover:text-blue-500 transition-colors">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-sm font-semibold leading-snug mb-1 truncate ${isActive ? "text-blue-700" : "text-gray-700 group-hover:text-gray-900"
                        }`}
                    >
                      {chapter.chapterTitle}
                    </h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Video size={10} /> Video Lesson
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;