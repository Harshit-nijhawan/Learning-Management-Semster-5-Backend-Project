import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import EnhancedHome from "./pages/EnhancedHome.jsx";
import TrendingCourses from "./components/TrendingCourses.jsx";
import BookSearch from "./components/Booksearch.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Explore from "./pages/Explore.jsx";
import ContactUs from "./components/ContactUs.jsx";
import RoleBasedDashboard from "./components/RoleBasedDashboard.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import CreateCourse from "./pages/CreateCourse.jsx";
import ShowCourses from "./pages/ShowCourses.jsx";
import UpdateCourse from "./pages/Updatecourse";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import ArticlePage from "./pages/ArticlePage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import Articles from "./pages/Articles.jsx";
import Problems from "./pages/Problems.jsx";
import LearningPaths from "./pages/LearningPaths.jsx";
import DailyQuestion from "./pages/DailyQuestion.jsx";

const ProtectedRoute = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

// REMOVED: The static CoursesWrapper function was deleted because it prevented 
// loading new courses from the database. The Route now points directly to CoursePage.

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<EnhancedHome />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/books" element={<BookSearch />} />
          
          <Route
            path="/ContactUs"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />

          {/* UPDATED: Direct route to CoursePage for dynamic data fetching */}
          <Route path="/course/:id" element={<CoursePage />} />

          <Route
            path="/trending"
            element={
              <ProtectedRoute>
                <TrendingCourses />
                <ContactUs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route 
            path="/create-course" 
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/update-course/:id" 
            element={
              <ProtectedRoute>
                <UpdateCourse />
              </ProtectedRoute>
            } 
          />

          <Route path="/show-courses" element={<ShowCourses />} />
          
          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          
          <Route path="/cart" element={<Cart />} />
          
          {/* GFG-Style Features */}
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemPage />} />
          <Route path="/paths" element={<LearningPaths />} />
          
          {/* Daily Coding Challenge */}
          <Route 
            path="/daily-question" 
            element={
              <ProtectedRoute>
                <DailyQuestion />
              </ProtectedRoute>
            } 
          />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;