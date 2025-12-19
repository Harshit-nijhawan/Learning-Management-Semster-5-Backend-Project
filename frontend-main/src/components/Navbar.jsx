import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import { useAuth } from "../context/AuthContext";
import { CircleUser, ShoppingCart, Code, BookOpen, TrendingUp, ChevronDown } from "lucide-react";

function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const [showPracticeMenu, setShowPracticeMenu] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const isStudent = user?.role === "student" || user?.role === "Student";
  const isInstructor = user?.role === "instructor" || user?.role === "Instructor";

  return (
    <div className="bg-white sticky top-0 w-full z-50 shadow-md left-0 transition-colors">
      <nav>
        <div className="flex justify-between items-center px-6 py-3">
          <div className="py-2 px-3 ml-0 md:ml-5 rounded-2xl cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-[30px] font-bold text-blue-600 text-shadow-2xs">
              Learnify
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6 font-semibold text-[#1B3C53]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 hover:text-blue-600 transition-colors"
              }
            >
              Home
            </NavLink>
            
            {/* Practice Dropdown - Show for students and non-logged users */}
            {!isInstructor && (
            <div 
              className="relative"
              onMouseEnter={() => setShowPracticeMenu(true)}
              onMouseLeave={() => setShowPracticeMenu(false)}
            >
              <button className="flex items-center gap-1 text-gray-800 hover:text-blue-600 transition-colors py-2">
                <Code className="w-4 h-4" />
                Practice
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showPracticeMenu && (
                <div className="absolute top-full left-0 pt-2">
                  <div className="w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    <NavLink
                      to="/articles"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Articles</div>
                        <div className="text-xs text-gray-500">Learn concepts</div>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/problems"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors"
                    >
                      <Code className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Problems</div>
                        <div className="text-xs text-gray-500">Solve challenges</div>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/paths"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-gray-900">Learning Paths</div>
                        <div className="text-xs text-gray-500">Guided journey</div>
                      </div>
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            )}
            {/* Daily Challenge - Show for students and non-logged users */}
            {!isInstructor && (
              <NavLink 
                to="/daily-question"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold flex items-center gap-1"
                    : "text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1"
                }
              >
                <span className="text-xl">🔥</span>
                Daily Challenge
              </NavLink>
            )}            
            {/* Instructor-specific: My Courses link */}
            {isInstructor && (
              <NavLink 
                to='/dashboard'
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-gray-800 hover:text-blue-600 transition-colors"
                }
              >
                My Courses
              </NavLink>
            )}

            <NavLink 
              to='/show-courses'
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 hover:text-blue-600 transition-colors"
              }
            >
              Courses
            </NavLink>
            <NavLink 
              to="/contactUs"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-600 font-bold"
                  : "text-gray-800 hover:text-blue-600 transition-colors"
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="space-x-3 hidden md:flex mr-5 items-center">
            {!token ? (
              <>
                <NavLink to="/login" className="py-2 font-semibold text-gray-800 hover:text-blue-600">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-blue-600 py-2.5 px-6 rounded-4xl text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  SignUp
                </NavLink>
              </>
            ) : (
              <>
                {isStudent && (
                  <button
                    onClick={() => navigate("/cart")}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full flex items-center gap-2 font-semibold transition-colors"
                    title="Cart"
                  >
                    <ShoppingCart size={22} />
                    Cart
                  </button>
                )}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2 font-semibold transition-colors"
                  title="Profile/Dashboard"
                >
                  <CircleUser size={22} />
                  {user?.name?.split(" ")[0] || "Profile"}
                </button>
              </>
            )}
          </div>

          {/* Hamburger shown only on mobile */}
          <div className="md:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
        </div>
        {isOpen && (
          <>
            <div className="md:hidden bg-white shadow-lg px-6 py-3 space-y-2 text-center font-semibold">
              <hr className="opacity-20 w-[100%]" />
              <NavLink to="/" className="block py-2 hover:text-blue-600 text-gray-800" onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/articles" className="block py-2 hover:text-blue-600 text-gray-800" onClick={() => setOpen(false)}>
                📚 Articles
              </NavLink>
              <NavLink to="/problems" className="block py-2 hover:text-blue-600 text-gray-800" onClick={() => setOpen(false)}>
                💻 Problems
              </NavLink>
              <NavLink to="/paths" className="block py-2 hover:text-blue-600 text-gray-800" onClick={() => setOpen(false)}>
                🎯 Learning Paths
              </NavLink>
              <NavLink to="/daily-question" className="block py-2 hover:text-blue-600 text-gray-800 font-semibold" onClick={() => setOpen(false)}>
                🔥 Daily Challenge
              </NavLink>
              <NavLink to="/show-courses" className="block py-2 hover:text-blue-600 text-gray-800" onClick={() => setOpen(false)}>
                Courses
              </NavLink>
              <NavLink to="/contactUs" className="block py-2 hover:text-blue-600 text-gray-800" onClick={() => setOpen(false)}>
                Contact
              </NavLink>
              <hr className="opacity-20 w-[100%]" />

              {!token ? (
                <>
                  <NavLink to="/login" className="block py-2 text-gray-800 hover:text-blue-600">
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="p-2 bg-gradient-to-r from-[#1B3C53] to-[#2A5470] text-white font-bold rounded-md hover:opacity-90 transition-opacity"
                  >
                    SignUp
                  </NavLink>
                </>
              ) : (
                <>
                  {isStudent && (
                    <button
                      onClick={() => navigate("/cart")}
                      className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold rounded-full w-full flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart size={22} />
                      Cart
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-full w-full flex items-center justify-center gap-2 transition-colors"
                  >
                    <CircleUser size={22} />
                    {user?.name?.split(" ")[0] || "Profile"}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;