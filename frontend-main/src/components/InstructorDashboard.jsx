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
  DollarSign,
  Menu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashCard from "./DashCard";
import InstructorCourseList from "./InstructorCourseList";
import UserList from "./UserList";
import api from "../utils/api";

function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [courseCount, setCourseCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [earnings, setEarnings] = useState(0);

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
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    api.get("/api/my-courses")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.courses || []);
        setCourseCount(data.length);

        // Calculate total students and earnings
        const totalStudents = data.reduce((acc, course) => acc + (course.studentsEnrolled || 0), 0);
        const totalEarnings = data.reduce((acc, course) => acc + ((course.price || 0) * (course.studentsEnrolled || 0)), 0);

        setStudentCount(totalStudents);
        setEarnings(totalEarnings);
      })
      .catch(() => {
        setCourseCount(0);
        setStudentCount(0);
        setEarnings(0);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashData = [
    {
      title: "My Courses",
      value: courseCount.toString(),
      change: "Active",
      icon: BookOpen,
    },
    {
      title: "Total Students",
      value: studentCount.toString(),
      change: "Enrolled",
      icon: Users
    },
    {
      title: "Earnings",
      value: `₹${earnings}`,
      change: "Total Revenue",
      icon: DollarSign,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={activeSection === "dashboard"}
          onClick={() => { setActiveSection("dashboard"); if (isMobile) setSidebarOpen(false); }}
        />
        <SidebarItem
          icon={<BookOpen size={20} />}
          text="My Courses"
          active={activeSection === "courses"}
          onClick={() => { setActiveSection("courses"); if (isMobile) setSidebarOpen(false); }}
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="My Students"
          active={activeSection === "students"}
          onClick={() => { setActiveSection("students"); if (isMobile) setSidebarOpen(false); }}
        />
        <SidebarItem
          icon={<MessageSquare size={20} />}
          text="Community"
          active={activeSection === "messages"}
          onClick={() => { setActiveSection("messages"); if (isMobile) setSidebarOpen(false); }}
        />
        <hr className="my-2 border-slate-700" />
        <SidebarItem
          icon={<CircleUser size={20} />}
          text="Profile"
          onClick={() => {
            const userId = user?._id || user?.id;
            if (userId) navigate(`/user/${userId}`);
            if (isMobile) setSidebarOpen(false);
          }}
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          onClick={handleLogout}
        />
      </Sidebar>

      {/* Mobile Menu Trigger */}
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
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Instructor Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Manage your courses and track your progress.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-bold text-lg text-blue-600">{user?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => navigate('/create-course')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <BookOpen size={24} />
                  Create New Course
                </button>
                <button
                  onClick={() => setActiveSection('courses')}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-md flex items-center gap-3"
                >
                  <LayoutDashboard size={24} className="text-gray-500" />
                  Manage Courses
                </button>
              </div>
            </div>

            {/* Recent Activity / Placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Overview</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                Select a course to view detailed analytics
              </div>
            </div>
          </>
        )}

        {activeSection === "courses" && (
          <div>
            <InstructorCourseList />
          </div>
        )}

        {activeSection === "students" && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Students</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
              Student list management coming soon.
            </div>
          </div>
        )}

        {activeSection === "messages" && (
          <div className="h-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 px-4">Community</h2>
            <DiscussionBoard currentUser={user} />
          </div>
        )}
      </main>
    </div>
  );
}

export default InstructorDashboard;
