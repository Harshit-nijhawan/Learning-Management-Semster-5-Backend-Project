import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getToken } from "../utils/cookieUtils";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState();

  useEffect(() => {
    // Fetch existing course details
    axios
      .get(`http://localhost:3001/api/courses/${id}`)
      .then((res) => {
        const course = res.data;
        setTitle(course.title || "");
        setDescription(course.description || "");
        setPrice(course.price || "");
      })
      .catch(() => {
        alert("Failed to fetch course details");
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("price", price);
    if (file) formdata.append("image", file);

    axios
      .put(`http://localhost:3001/api/courses/${id}`, formdata, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Course updated successfully!");
        navigate("/dashboard");
      })
      .catch((err) => {
        alert(
          err.response?.data?.message ||
            "Error updating course. Please try again."
        );
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-10">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
            Update Course
          </h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Course Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                required
                rows={4}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Course Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Course Image
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border border-blue-300 p-3 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-bold text-lg hover:bg-blue-700 transition"
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpdateCourse;
