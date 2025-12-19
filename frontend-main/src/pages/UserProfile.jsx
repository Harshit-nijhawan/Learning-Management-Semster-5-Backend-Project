import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Shield,
  BookOpen,
  Calendar,
  Award,
  ArrowLeft,
  MapPin,
  Briefcase,
  Edit2,
  GraduationCap,
  Star,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getToken } from "../utils/cookieUtils";
import { useAuth } from "../context/AuthContext";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use current user's ID if no ID is provided in URL
  const profileUserId = id || currentUser?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!profileUserId) {
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user profile
        const userResponse = await fetch(
          `http://localhost:3001/api/protected/user/${profileUserId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setUser(userData);

        // If user is an instructor, fetch their courses
        if (userData.role === "instructor") {
          try {
            // If viewing current user's profile, use my-courses endpoint
            // Otherwise, fetch courses by instructor ID
            const coursesEndpoint =
              !id || id === currentUser?._id
                ? "http://localhost:3001/api/my-courses"
                : `http://localhost:3001/api/courses/instructor/${profileUserId}`;

            const coursesResponse = await fetch(coursesEndpoint, {
              headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
              },
            });

            if (coursesResponse.ok) {
              const coursesData = await coursesResponse.json();
              setUserCourses(coursesData);
            }
          } catch (coursesError) {
            console.error("Error fetching instructor courses:", coursesError);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [profileUserId, id, currentUser?._id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border border-red-200";
      case "instructor":
        return "bg-green-100 text-green-800 border border-green-200";
      case "student":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              <p className="font-medium">Error: {error}</p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>

              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

                {/* Profile Info */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                        <User className="w-16 h-16 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 text-center sm:text-left">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user.name}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          <Shield className="w-3.5 h-3.5" />
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                        {user.createdAt && (
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Joined {formatDate(user.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              {user.role !== "admin" && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {user.role === "instructor" ? userCourses.length : user.purchasedCourses?.length || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Certificates</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Learning Hours</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                        <p className="text-2xl font-bold text-gray-900">4.8</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-1">Email Address</p>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.number || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructor Courses Section */}
              {user.role === "instructor" && userCourses.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Published Courses
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userCourses.slice(0, 6).map((course) => (
                      <div
                        key={course._id}
                        className="group bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        <div className="relative h-36 overflow-hidden bg-gray-200">
                          {course.image && (
                            <img
                              src={`http://localhost:3001/images/${course.image}`}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                            ${course.price}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {course.curriculum?.length || 0} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              {course.rating || "New"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center">
              <p className="font-medium">User not found.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserProfile;
