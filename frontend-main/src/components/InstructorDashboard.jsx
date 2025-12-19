import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Users,
  BookOpen,
  CircleUser,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashCard from "./DashCard";
import InstructorCourseList from "./InstructorCourseList";
import UserList from "./UserList";
import api from "../utils/api";
import { getToken } from "../utils/cookieUtils";

function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch instructor's courses count
  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const token = getToken();

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await api.get("/api/my-courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourseCount(response.data.length);
      } catch (error) {
        console.error("Error fetching course count:", error);
        setCourseCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourseCount();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked, user:", user);
    const userId = user?._id || user?.id;
    if (userId) {
      console.log("Navigating to:", `/user/${userId}`);
      navigate(`/user/${userId}`);
    } else {
      console.log("No user ID found");
    }
  };

  const dashData = [
    {
      title: "My Courses",
      value: loading ? "..." : courseCount.toString(),
      change: courseCount > 0 ? `${courseCount} total` : "No courses yet",
      icon: BookOpen,
    },
    { title: "Enrolled Students", value: "320", change: "+15", icon: Users },
    {
      title: "Messages",
      value: "12",
      change: "-1 unread",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar>
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
          icon={<Users size={20} />} 
          text="Students"
          active={activeSection === "students"}
          onClick={() => setActiveSection("students")}
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
          onClick={handleProfileClick}
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || "Instructor"}
              </h1>
              <p className="text-gray-600 mt-2">Here's your teaching overview and recent activity.</p>
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
            
            {/* Quick Actions */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/create-course')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  Create New Course
                </button>
                <button
                  onClick={() => setActiveSection('courses')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  View My Courses
                </button>
              </div>
            </div>
          </>
        )}
        {activeSection === "courses" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <button
                onClick={() => navigate('/create-course')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <BookOpen size={20} />
                Create New Course
              </button>
            </div>
            <InstructorCourseList />
          </div>
        )}
        {activeSection === "students" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Students</h1>
            <UserList type="student" showDelete={false} />
          </div>
        )}
        {activeSection === "messages" && (
          <div className="mt-10 ml-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Messages</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default InstructorDashboard;
