import React, { useState, useEffect } from "react";
import { Star, Clock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function ShowCourses() {
  const [courses, setCourses] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://lms-backend-39hl.onrender.com" : "http://localhost:3001");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await api.get("/api/allCourses");
        const coursesData = coursesResponse.data;

        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        } else if (coursesData && Array.isArray(coursesData.courses)) {
          setCourses(coursesData.courses);
        } else {
          setCourses([]);
        }

        if (user && user.role === "student") {
          try {
            const cartResponse = await api.get("/api/protected/cart");
            setCart(cartResponse.data);
          } catch (cartError) {
            console.error("Error fetching cart:", cartError);
            // If cart fetch fails, set to empty array
            setCart([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = async (course) => {
    console.log("=== ADD TO CART DEBUG ===");
    console.log("User:", user);
    console.log("Course ID:", course._id);
    console.log("Course Title:", course.title);

    if (!user) {
      alert("Please login to add courses to cart");
      return;
    }

    console.log("User role:", user.role);
    if (user.role !== "student") {
      alert("Only students can add courses to cart");
      return;
    }

    const courseInCart = cart.find((item) => item._id === course._id);
    if (courseInCart) {
      alert("Course already in cart!");
      return;
    }

    try {
      console.log("Sending request to /api/protected/cart with courseId:", course._id);
      const response = await api.post("/api/protected/cart", {
        courseId: course._id,
      });

      console.log("Response received:", response.data);
      setCart(response.data.cart);
      alert("Course added to cart!");
    } catch (error) {
      console.error("=== CART ERROR ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      const errorMessage = error.response?.data?.message || "Failed to add course to cart";
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <>
      <Navbar />
      <section className="px-24 py-10 flex flex-col items-center h-full justify-center gap-5 max-sm:px-2 max-md:px-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <h1 className="text-5xl font-semibold text-gray-900 font-secondary text-center">
          Explore Courses
        </h1>
        <p className="text-center text-gray-700">
          Empower your growth through engaging, real-world learning experiences.
        </p>
        <div className="relative inline-block w-[60vw] max-md:w-full">
          <input
            type="search"
            name="search"
            placeholder="Search Courses"
            className="border border-gray-300 py-3 pl-5 pr-35 rounded-full w-full bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button className="absolute right-1 px-10 py-2 bg-blue-600 text-white rounded-full top-[9%] cursor-pointer hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </section>
      <section className="flex justify-between md:px-10 px-2 max-sm:flex-col max-md:gap-2 bg-white py-4 border-b border-gray-200">
        <div>
          <ul className="flex gap-1">
            <li className="px-1 md:px-2 md:py-1 border border-gray-300 cursor-pointer max-md:text-sm bg-white text-gray-900 hover:bg-gray-100 transition rounded">
              Web Development
            </li>
            <li className="px-1 md:px-2 md:py-1 border border-gray-300 cursor-pointer max-md:text-sm bg-white text-gray-900 hover:bg-gray-100 transition rounded">
              Science
            </li>
            <li className="px-1 md:px-2 md:py-1 border border-gray-300 cursor-pointer max-md:text-sm bg-white text-gray-900 hover:bg-gray-100 transition rounded">
              Tech
            </li>
            <li className="px-1 md:px-2 md:py-1 border border-gray-300 cursor-pointer max-md:text-sm bg-white text-gray-900 hover:bg-gray-100 transition rounded">
              Marketing
            </li>
          </ul>
        </div>
        <div>
          <select name="filters" id="filters" className="bg-white text-gray-900 border border-gray-300 px-3 py-1 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="newest">Newest</option>
            <option value="mostrated">Most rated</option>
            <option value="mostrelevant">Most Relevant</option>
            <option value="priceasc">By price:asc</option>
            <option value="pricedesc">By price:desc</option>
          </select>
        </div>
      </section>
      <main className="px-1 md:px-4 lg:px-8 h-full mt-10 bg-white pb-10">
        <section className="sm:grid lg:grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3 flex flex-wrap justify-center">
          {courses.length > 0 ? (
            courses.map((course, idx) => (
              <div
                key={course._id || idx}
                className="bg-white rounded-xl shadow-md hover:shadow-xl flex flex-col mb-6 border border-gray-200 transition-all"
              >
                <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
                  {course.image ? (
                    <img
                      src={`${baseURL}/images/${course.image}`}
                      alt={course.title || "Course"}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        console.log(
                          `✅ Image loaded successfully: ${e.target.src}`
                        );
                      }}
                      onError={(e) => {
                        console.log(`❌ Failed to load: ${e.target.src}`);
                        // Show fallback
                        e.target.style.display = "none";
                        const fallback =
                          e.target.parentNode.querySelector(".fallback-image");
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="fallback-image absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 items-center justify-center"
                    style={{ display: course.image ? "none" : "flex" }}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3">📚</div>
                      <span className="text-gray-600 font-medium">
                        Course Image
                      </span>
                      {course.image && (
                        <div className="text-xs text-gray-400 mt-1">
                          {course.image}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
                    {course.title}
                  </h3>
                  {course.instructor && (
                    <p className="text-gray-600 text-sm mb-2">
                      by{" "}
                      <span className="font-semibold text-blue-600">
                        {course.instructor.name}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                      <Star className="w-5 h-5 fill-yellow-500" />
                      {course.rating || 0}
                    </span>
                    <span className="text-blue-600 font-bold text-md">
                      ₹{course.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {course.hours || "N/A"} hrs</span>
                  </div>
                  {course.studentsEnrolled > 0 && (
                    <div className="text-gray-600 text-sm mt-1">
                      {course.studentsEnrolled} students enrolled
                    </div>
                  )}
                  {(!user || user.role === "student") && (
                    <button
                      className="bg-blue-600 text-white px-5 py-2 mt-4 rounded-md w-full hover:bg-blue-700 transition duration-200 font-semibold"
                      onClick={() => handleAddToCart(course)}
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-12 w-full">
              {loading ? "Loading courses..." : "No courses found"}
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ShowCourses;
