import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import { useAuth } from "../context/AuthContext";
import { CircleUser, ShoppingCart } from "lucide-react";

function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const isStudent = user?.role === "student" || user?.role === "Student";

  return (
    <div className="bg-white sticky top-0 w-full z-50 shadow-md left-0">
      <nav>
        <div className="flex justify-between items-center px-6 py-3 ">
          <div className=" py-2 px-3 ml-0 md:ml-5 rounded-2xl">
            <h1 className="text-[30px] font-bold text-blue-600 text-shadow-2xs">
              Learnify
            </h1>
          </div>

          <div className="space-x-5 hidden md:flex font-semibold text-[#1B3C53] opacity-90">
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                isActive
                  ? "text-blue-600 font-bold"
                  : isPending
                  ? "text-gray-500"
                  : "text-gray-800"
              }
            >
              Home
            </NavLink>
            <NavLink to='/show-courses'>Courses</NavLink>
            <NavLink>About</NavLink>
            <NavLink to="/contactUs">Contact</NavLink>
          </div>

          <div className="space-x-3 hidden md:flex mr-5">
            {!token ? (
              <>
                <NavLink to="/login" className="py-2 font-semibold">
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-blue-600 py-2.5 px-6 rounded-4xl text-white font-semibold"
                >
                  SignUp
                </NavLink>
              </>
            ) : (
              <>
                {isStudent && (
                  <button
                    onClick={() => navigate("/cart")}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full flex items-center gap-2 font-semibold"
                    title="Cart"
                  >
                    <ShoppingCart size={22} />
                    Cart
                  </button>
                )}
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2 font-semibold"
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
            <div className="md:hidden  bg-white shadow-lg px-6 py-3 space-y-2 text-center font-semibold">
              <hr className="opacity-20 w-[100%]" />
              <NavLink className="block">Home</NavLink>
              <NavLink to='/show' className="block">Courses</NavLink>
              <NavLink className="block">About</NavLink>
              <NavLink className="block">Contact</NavLink>
              <hr className="opacity-20 w-[100%]" />

              {!token ? (
                <>
                  <NavLink to="/login" className="block">
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="p-2 bg-gradient-to-r from-[#1B3C53] to-[#2A5470] text-white font-bold rounded-md"
                  >
                    SignUp
                  </NavLink>
                </>
              ) : (
                <>
                  {isStudent && (
                    <button
                      onClick={() => navigate("/cart")}
                      className="p-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold rounded-full w-full flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={22} />
                      Cart
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-full w-full flex items-center justify-center gap-2"
                  >
                    <CircleUser size={22} />
                    {user?.name?.split(" ")[0] || "Profile"}
                  </button>
                </>
              )}
            </div>
            <div className=""></div>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;