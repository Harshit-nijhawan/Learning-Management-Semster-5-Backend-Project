import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
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

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [purchasedCoursesCount, setPurchasedCoursesCount] = useState(0);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [userStats, setUserStats] = useState(null);

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
      <Sidebar>
        <SidebarItem
          icon={<Home size={20} />}
          text="Home"
          onClick={() => navigate('/')}
        />
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={activeSection === "dashboard"}
          onClick={() => setActiveSection("dashboard")}
        />
        <SidebarItem
          icon={<BookOpen size={20} />}
          text="My Courses"
          active={activeSection === "courses"}
          onClick={() => setActiveSection("courses")}
        />

        <SidebarItem
          icon={<MessageSquare size={20} />}
          text="Messages"
          active={activeSection === "messages"}
          onClick={() => setActiveSection("messages")}
        />
        <hr className="text-zinc-200" />
        <SidebarItem
          icon={<CircleUser size={20} />}
          text="Profile"
          onClick={() => {
            console.log("Profile clicked in StudentDashboard");
            const userId = user?._id || user?.id;
            if (userId) {
              navigate(`/user/${userId}`);
            }
          }}
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          onClick={handleLogout}
        />
      </Sidebar>
      <main className="flex-1 p-6 bg-white ml-60 min-h-screen">
        {activeSection === "dashboard" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(" ")[0] || "Student"}
                </h1>
                <p className="text-gray-600">Here's your learning overview and recent activity.</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
            </div>
            <div className="flex flex-wrap w-full gap-5 mt-10">
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

            {/* Daily Challenge Widget */}
            {dailyQuestion && (
              <div className="mt-10">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => navigate('/daily-question')}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-8 h-8" />
                        <div>
                          <h3 className="text-xl font-bold">Daily Coding Challenge</h3>
                          <p className="text-blue-100 text-sm">
                            {new Date(dailyQuestion.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-semibold mb-2">{dailyQuestion.title}</h4>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          dailyQuestion.difficulty === 'Easy' ? 'bg-green-500' :
                          dailyQuestion.difficulty === 'Medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        } bg-opacity-20 backdrop-blur-sm`}>
                          {dailyQuestion.difficulty}
                        </span>
                        {dailyQuestion.tags && dailyQuestion.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        Solve Now →
                      </button>
                    </div>
                    
                    {userStats && (
                      <div className="flex flex-col gap-3 ml-6">
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[100px]">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Flame className="w-5 h-5 text-orange-300" />
                            <span className="text-2xl font-bold">{userStats.currentStreak}</span>
                          </div>
                          <p className="text-xs text-blue-100">Day Streak</p>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-3 text-center min-w-[100px]">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Trophy className="w-5 h-5 text-yellow-300" />
                            <span className="text-2xl font-bold">{userStats.solvedCount}</span>
                          </div>
                          <p className="text-xs text-blue-100">Solved</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Enrolled Courses Preview */}
            {purchasedCourses.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h2>
                  <button
                    onClick={() => setActiveSection('courses')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {purchasedCourses.slice(0, 3).map((course) => (
                    <div
                      key={course._id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                        {course.image && (
                          <img
                            src={`http://localhost:3001/images/${course.image}`}
                            alt={course.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                          {course.curriculum?.length || 0} Lessons
                        </p>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                          Continue Learning
                        </button>
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
          <div className="mt-10 ml-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Messages</h2>
            <p className="text-gray-600">Coming soon...</p>
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
