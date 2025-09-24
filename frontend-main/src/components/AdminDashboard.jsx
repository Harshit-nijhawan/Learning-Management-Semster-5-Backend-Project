import React, { useState, useEffect } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import {
  LayoutDashboard,
  LogOut,
  Users,
  GraduationCap,
  BookOpen,
  CircleUser,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import DashCard from "./DashCard";
import UserList from "./UserList";
import CourseList from "./CourseList";
import axios from "axios";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  // State for actual counts
  const [studentCount, setStudentCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    // Fetch students count
    axios
      .get("http://localhost:3001/api/protected/students")
      .then((res) => setStudentCount(res.data.length))
      .catch(() => setStudentCount(0));
    // Fetch instructors count
    axios
      .get("http://localhost:3001/api/protected/instructors")
      .then((res) => setInstructorCount(res.data.length))
      .catch(() => setInstructorCount(0));
    // Fetch courses count
    axios
      .get("http://localhost:3001/api/allCourses")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourseCount(res.data.length);
        } else if (res.data && Array.isArray(res.data.courses)) {
          setCourseCount(res.data.courses.length);
        }
      })
      .catch(() => setCourseCount(0));
  }, []);

  const dashData = [
    {
      title: "Total Students",
      value: studentCount,
      change: "+12.5%",
      icon: Users,
    },
    {
      title: "Instructors",
      value: instructorCount,
      change: "+5%",
      icon: GraduationCap,
    },
    {
      title: "Courses",
      value: courseCount || 0,
      change: "+8%",
      icon: BookOpen,
    },
    { title: "Revenues", value: "$50K", change: "+15%", icon: DollarSign },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
          icon={<Users size={20} />}
          text="Students"
          active={activeSection === "students"}
          onClick={() => setActiveSection("students")}
        />
        <SidebarItem
          icon={<GraduationCap size={20} />}
          text="Instructor"
          active={activeSection === "instructor"}
          onClick={() => setActiveSection("instructor")}
        />
        <SidebarItem
          icon={<BookOpen size={20} />}
          text="Courses"
          active={activeSection === "courses"}
          onClick={() => setActiveSection("courses")}
        />
        <hr className="text-zinc-200" />
        <SidebarItem
          icon={<CircleUser size={20} />}
          text="Profile"
          onClick={() => {
            console.log("Profile clicked in AdminDashboard");
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
      <main className="flex-1 p-6 bg-gray-50 min-h-screen ml-60">
        <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
        {/* Conditional rendering based on activeSection */}
        {activeSection === "dashboard" && (
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
        )}
        {activeSection === "instructor" && (
          <div className="mt-10 ml-4">
            <UserList />
          </div>
        )}
        {activeSection === "students" && (
          <div className="mt-10 ml-4">
            <UserList type="student" />
          </div>
        )}
        {activeSection === "courses" && (
          <div className="mt-10 ml-4">
            <CourseList showEdit={false} />
          </div>
        )}
        {/* Add other sections as needed */}
      </main>
    </div>
  );
}

export default AdminDashboard;
