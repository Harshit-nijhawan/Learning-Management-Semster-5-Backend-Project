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
import { useNavigate, Link } from "react-router-dom";
import DashCard from "./DashCard";
import InstructorCourseList from "./InstructorCourseList";
import axios from "axios";

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
        const token =
          localStorage.getItem("token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3001/api/my-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    <div className="flex">
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
        <SidebarItem icon={<Users size={20} />} text="Students" />
        <SidebarItem icon={<MessageSquare size={20} />} text="Messages" />
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
      <main className="flex-1 p-6 bg-gray-50 ml-60 min-h-screen">
        {activeSection === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name || "Instructor"}
            </h1>
            <p>Here's your teaching overview and recent activity.</p>
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
        {activeSection === "courses" && <InstructorCourseList />}
      </main>
    </div>
  );
}

export default InstructorDashboard;
