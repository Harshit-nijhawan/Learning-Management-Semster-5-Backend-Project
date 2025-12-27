import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import DiscussionBoard from "./DiscussionBoard";
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Users,
  BookOpen,
  CircleUser,
  ShoppingCart,
  Home,
  Settings,
  ArrowLeft,
  Calendar,
  Flame,
  Trophy,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashCard from "./DashCard";
import Cart from "../pages/Cart";
import StudentCourseList from "./StudentCourseList";
import api from "../utils/api";

import { Menu, X } from "lucide-react";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [purchasedCoursesCount, setPurchasedCoursesCount] = useState(0);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [userStats, setUserStats] = useState(null);

  // Responsive Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ... (fetch hooks remain the same)

  // Fetch student's purchased courses count
  useEffect(() => {
    const fetchPurchasedCoursesCount = async () => {
      try {
        const response = await api.get("/api/protected/student/courses");
        setPurchasedCourses(response.data);
        setPurchasedCoursesCount(response.data.length);
      } catch (error) {
        console.error("Error fetching purchased courses count:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPurchasedCoursesCount();
    }
  }, [user]);

  // Fetch daily question and user stats
  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const [questionRes, statsRes] = await Promise.all([
          api.get('/api/daily-question/today'),
          api.get('/api/daily-question/my-stats')
        ]);
        setDailyQuestion(questionRes.data.question);
        setUserStats(statsRes.data.stats);
      } catch (error) {
        console.error('Error fetching daily question data:', error);
      }
    };

    if (user) {
      fetchDailyData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashData = [
    {
      title: "Courses Enrolled",
      value: loading ? "..." : purchasedCoursesCount.toString(),
      change:
        purchasedCoursesCount > 0
          ? `${purchasedCoursesCount} total`
          : "No courses yet",
      icon: BookOpen,
    },
    { title: "Messages", value: "2", change: "0 unread", icon: MessageSquare },
    { title: "Progress", value: "80%", change: "+10%", icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarItem
          icon={<Home size={20} />}
          text="Home"
          onClick={() => {
            navigate('/');
            if (isMobile) setSidebarOpen(false);
          }}
        />
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={activeSection === "dashboard"}
          onClick={() => {
            setActiveSection("dashboard");
            if (isMobile) setSidebarOpen(false);
          }}
        />
        <SidebarItem
          icon={<BookOpen size={20} />}
          text="My Courses"
          active={activeSection === "courses"}
          onClick={() => {
            setActiveSection("courses");
            if (isMobile) setSidebarOpen(false);
          }}
        />

        <SidebarItem
          icon={<MessageSquare size={20} />}
          text="Community"
          active={activeSection === "messages"}
          onClick={() => {
            setActiveSection("messages");
            if (isMobile) setSidebarOpen(false);
          }}
        />
        <hr className="text-zinc-200" />
        <SidebarItem
          icon={<CircleUser size={20} />}
          text="Profile"
          onClick={() => {
            const userId = user?._id || user?.id;
            if (userId) {
              navigate(`/user/${userId}`);
            }
            if (isMobile) setSidebarOpen(false);
          }}
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          onClick={handleLogout}
        />
      </Sidebar>

      {/* Mobile Header for specific cases if needed, otherwise rely on the main content margin adjustment */}
      {!sidebarOpen && isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-md text-gray-700"
        >
          <Menu size={24} />
        </button>
      )}

      <main
        className={`flex-1 p-8 bg-gray-50 min-h-screen transition-all duration-300
          ${isMobile ? "ml-0" : (sidebarOpen ? "ml-64" : "ml-20")}
        `}
      >
        {activeSection === "dashboard" && (
          <>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
                  </h1>
                  <p className="text-blue-100 text-lg opacity-90 max-w-lg">
                    You've made great progress this week. Keep up the momentum!
                  </p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Back to Home
                </button>
              </div>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {dashData.map((data, index) => (
                <DashCard
                  key={index}
                  title={data.title}
                  value={data.value}
                  change={data.change}
                  Icon={data.icon}
                />
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Daily Challenge Widget - Spans 2 cols */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Flame className="text-orange-500" /> Daily Challenge
                </h2>
                {dailyQuestion ? (
                  <div
                    className="group bg-white rounded-3xl border border-gray-100 p-1 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => navigate('/daily-question')}
                  >
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-[22px] p-8 text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Today's Question</p>
                              <h3 className="text-2xl font-bold mt-1">{dailyQuestion.title}</h3>
                            </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-white/20 ${dailyQuestion.difficulty === 'Easy' ? 'bg-green-500/90' :
                            dailyQuestion.difficulty === 'Medium' ? 'bg-yellow-500/90' : 'bg-red-500/90'
                            }`}>
                            {dailyQuestion.difficulty}
                          </span>
                        </div>

                        <div className="flex items-end justify-between">
                          <div className="flex gap-2">
                            {dailyQuestion.tags?.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-3 py-1 bg-black/20 backdrop-blur-sm rounded-lg text-sm border border-white/10">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button className="bg-white text-violet-600 px-6 py-2.5 rounded-xl font-bold hover:bg-violet-50 transition-colors shadow-lg group-hover:scale-105 duration-300">
                            Solve Now
                          </button>
                        </div>
                      </div>

                      {/* Background Effect */}
                      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-fuchsia-500/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </div>
                )}
              </div>

              {/* Right Column - Streak / Enrolled Mini List */}
              <div className="lg:col-span-1 space-y-6">
                {userStats && (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Your Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <Flame size={20} />
                          </div>
                          <span className="font-semibold text-gray-700">Day Streak</span>
                        </div>
                        <span className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                            <Trophy size={20} />
                          </div>
                          <span className="font-semibold text-gray-700">Solved</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{userStats.solvedCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enrolled Courses Section */}
            {purchasedCourses.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Enrolled Courses</h2>
                  <button
                    onClick={() => setActiveSection('courses')}
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group"
                  >
                    View All <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {purchasedCourses.slice(0, 4).map((course) => (
                    <div
                      key={course._id}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        {course.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://lms-backend-39hl.onrender.com" : "http://localhost:3001")}/images/${course.image}`}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <BookOpen className="text-gray-400 w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white font-semibold text-sm">Continue Learning</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">Video Course</span>
                          <span>• {course.curriculum?.length || 0} Lessons</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full w-[40%] rounded-full"></div>
                        </div>
                        <p className="text-right text-xs text-gray-400 mt-1">40% Complete</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {activeSection === "courses" && <StudentCourseList />}
        {activeSection === "cart" && <Cart />}
        {activeSection === "home" && (
          <div className="mt-10 ml-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">
              Student Home
            </h2>
            <p className="text-gray-600">Welcome to your student dashboard!</p>
          </div>
        )}
        {activeSection === "messages" && (
          <div className="h-full">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 px-4">Community</h2>
            <DiscussionBoard currentUser={user} />
          </div>
        )}
        {activeSection === "settings" && (
          <div className="mt-10 ml-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Settings</h2>
            <p className="text-gray-600">Update your profile and preferences here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
