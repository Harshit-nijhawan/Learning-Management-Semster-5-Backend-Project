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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import DashCard from "./DashCard";
import Cart from "../pages/Cart";
import StudentCourseList from "./StudentCourseList";
import { getToken } from "../utils/cookieUtils";

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [purchasedCoursesCount, setPurchasedCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch student's purchased courses count
  useEffect(() => {
    const fetchPurchasedCoursesCount = async () => {
      try {
        const token = getToken();
        if (!token) {
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

        if (response.ok) {
          const courses = await response.json();
          setPurchasedCoursesCount(courses.length);
        }
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    if (user?._id) {
      navigate(`/user/${user._id}`);
    }
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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
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
      <main className="flex-1 p-6 bg-gray-50 ml-60 min-h-screen">
        {activeSection === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name?.split(" ")[0] || "Student"}
            </h1>
            <p>Here's your learning overview and recent activity.</p>
            <div className="flex flex-wrap w-full gap-5 mt-10 ml-4">
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
          </>
        )}
        {activeSection === "courses" && <StudentCourseList />}
        {activeSection === "cart" && <Cart />}
        {activeSection === "home" && (
          <div className="mt-10 ml-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">
              Student Home
            </h2>
            <p>Welcome to your student dashboard!</p>
          </div>
        )}
        {activeSection === "messages" && (
          <div className="mt-10 ml-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Messages</h2>
            <p>Coming soon...</p>
          </div>
        )}
        {activeSection === "settings" && (
          <div className="mt-10 ml-4">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Settings</h2>
            <p>Update your profile and preferences here.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
