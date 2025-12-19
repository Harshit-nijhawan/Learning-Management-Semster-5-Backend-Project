import React, { useEffect, useState } from "react";
import { BookOpen, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; 

function StudentCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await api.get("/api/protected/student/courses");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchasedCourses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-10 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-700">My Learning</h2>
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-40 overflow-hidden bg-gray-100">
                {course.image && (
                  <img
                    src={`http://localhost:3001/images/${course.image}`}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wide">
                  {course.curriculum?.length || 0} Lessons
                </p>

                <div className="mt-auto">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => {
                        if (course._id && !course._id.includes("<")) {
                            navigate(`/course/${course._id}`);
                        } else {
                            console.error("Invalid ID, skipping navigation");
                        }
                    }}
                  >
                    <PlayCircle size={18} /> Open Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Start your journey
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't enrolled in any courses yet.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium cursor-pointer transition-colors"
            onClick={() => navigate("/show-courses")}
          >
            Explore Courses
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentCourseList;