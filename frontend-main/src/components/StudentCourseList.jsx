import React, { useEffect, useState } from "react";
import { BookOpen, Star, Clock, User } from "lucide-react";
import { getToken } from "../utils/cookieUtils";

function StudentCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        setLoading(true);
        const token = getToken();

        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:3001/api/protected/student/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching purchased courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-blue-700">
          My Purchased Courses
        </h2>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
          {courses.length} {courses.length === 1 ? "Course" : "Courses"}
        </span>
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {course.image && (
                <div className="mb-4">
                  <img
                    src={`http://localhost:3001/images/${course.image}`}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
                  {course.title}
                </h3>

                {course.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {course.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      ₹{course.price || 0}
                    </span>

                    {course.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {course.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {course.instructor && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>
                      Instructor: {course.instructor.name || "Unknown"}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-blue-200">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    onClick={() => {
                      // TODO: Navigate to course content/learning page
                      console.log("Start learning:", course.title);
                    }}
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Courses Purchased Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start your learning journey by purchasing some courses!
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200"
            onClick={() => {
              // TODO: Navigate to course catalog
              window.location.href = "/show-courses";
            }}
          >
            Explore Courses
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentCourseList;
