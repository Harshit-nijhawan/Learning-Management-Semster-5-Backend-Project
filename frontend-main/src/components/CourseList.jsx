import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UpdateCourse from "../pages/Updatecourse";
import { getToken } from "../utils/cookieUtils";
function CourseList({ showEdit = true }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/allCourses")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">All Courses</h2>
      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : courses.length > 0 ? (
        <table className="w-full text-left border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr
                key={course._id || idx}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="py-3 px-4 font-semibold">{course.title}</td>
                <td className="py-3 px-4 text-blue-600 font-bold">
                  ₹{course.price}
                </td>
                <td className="py-3 px-4">{course.rating ?? "N/A"}</td>
                <td className="py-3 px-4 flex justify-center gap-4">
                  {showEdit && (
                    <button
                      onClick={() => handleEdit(course._id)}
                      className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded transition flex items-center gap-1"
                      title="Edit"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>
                  )}
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
                    <Trash2 size={18} />
                    {deletingId === course._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center py-8">No courses found</p>
      )}
    </div>
  );
}

export default CourseList;
