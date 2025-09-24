import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PasswordIcon from '../icons/PasswordIcon';
import EmailIcon from '../icons/EmailIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeOffIcon from '../icons/EyeOffIcon';

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, seterrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted ✅");

    let newerrors = {};
    if (!email) newerrors.email = "Email is required!";
    if (!password) newerrors.password = "Password is required!";

    seterrors(newerrors);
    console.log("Validation errors:", newerrors);

    if (Object.keys(newerrors).length > 0) {
      console.log("Validation failed ❌");
      return;
    }

    try {
      console.log("Sending request with:", { email, password });

      const response = await api.post('/login', {
        email,
        password,
      });

      console.log("API Response ✅:", response.data);

      if (response.data.token) {
        login(response.data.token, response.data.user);
        const userRole = response.data.user.role;
        console.log("User Role:", userRole);

        navigate('/');
      } else {
        console.warn("No token found in response ❌");
      }
    } catch (error) {
      console.error("Login error ❌:", error);

      if (error.response?.data?.message) {
        seterrors({ general: error.response.data.message });
      } else {
        seterrors({ general: "Login failed. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 tracking-wide">
          Login to Learnify
        </h2>
        <form className="space-y-5" onSubmit={handlesubmit}>
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email} // controlled input ✅
                className={`w-full pl-10 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3C53] outline-none transition duration-150 
                  ${errors.email ? "border-red-600" : "border-gray-300"}`}
                onChange={(e) => setemail(e.target.value)}
                onFocus={() => seterrors((prev) => ({ ...prev, email: "" }))}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PasswordIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password} // controlled input ✅
                className={`w-full pl-10 pr-12 px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#1B3C53] outline-none transition duration-150 
                  ${errors.password ? "border-red-500" : "border-gray-300"}`}
                onChange={(e) => setpassword(e.target.value)}
                onFocus={() =>
                  seterrors((prev) => ({ ...prev, password: "" }))
                }
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:ring-offset-2 transition duration-150 font-medium"
          >
            Sign In
          </button>
        </form>

        <hr className="border-gray-400" />

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
