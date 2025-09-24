import React, { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/cookieUtils";

function InstructorCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/my-courses", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      } else {
        console.error("Failed to fetch courses:", data.message);
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setDeletingId(id);
      try {
        const res = await fetch(`http://localhost:3001/api/courses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setCourses((prev) => prev.filter((course) => course._id !== id));
        } else {
          alert(data.message || "Failed to delete course");
        }
      } catch (err) {
        alert("Failed to delete course");
      }
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-course/${id}`);
  };

  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">My Courses</h2>
        <button
          onClick={handleCreateCourse}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">
          Loading your courses...
        </p>
      ) : courses.length > 0 ? (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      ₹{course.price}
                    </span>
                    <span>Rating: {course.rating || "Not rated"}</span>
                    <span>Students: {course.studentsEnrolled}</span>
                    <span>
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {course.image && (
                  <img
                    src={`http://localhost:3001/images/${course.image}`}
                    alt={course.title}
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEdit(course._id)}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded transition flex items-center gap-1"
                  title="Edit"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className={`bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition flex items-center gap-1 ${
                    deletingId === course._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title="Delete"
                  disabled={deletingId === course._id}
                >
                  <Trash2 size={16} />
                  {deletingId === course._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            You haven't created any courses yet
          </p>
          <button
            onClick={handleCreateCourse}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Create Your First Course
          </button>
        </div>
      )}
    </div>
  );
}

export default InstructorCourseList;
