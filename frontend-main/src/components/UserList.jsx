import React, { useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { getToken } from "../utils/cookieUtils";

function UserList({ type = "instructor", showDelete = true }) {
  const [users, setUsers] = React.useState([]);
  const [deletingId, setDeletingId] = React.useState(null);

  useEffect(() => {
    const endpoint =
      type === "student"
        ? "http://localhost:3001/api/protected/students"
        : "http://localhost:3001/api/protected/instructors";
    axios
      .get(endpoint)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, [type]);

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      setDeletingId(userId);
      try {
        // Try multiple ways to get the token
        const token =
          getToken() ||
          localStorage.getItem("token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        console.log(
          "Token being used:",
          token ? "Token found" : "No token found"
        );

        if (!token) {
          alert("Authentication token not found. Please login again.");
          return;
        }

        const response = await axios.delete(
          `http://localhost:3001/api/protected/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Remove user from the list
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          alert("User deleted successfully!");
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        if (error.response?.status === 401) {
          alert("Unauthorized. Please check if you're logged in as admin.");
        } else if (error.response?.status === 403) {
          alert("Forbidden. You don't have permission to delete users.");
        } else {
          alert(
            `Failed to delete user: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="inline-block w-2 h-6 bg-blue-500 rounded mr-2"></span>
        {type === "student" ? "Students" : "Instructors"}
        <span className="text-blue-500 ml-2">({users.length})</span>
      </h2>
      {users.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No {type === "student" ? "students" : "instructors"} found.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li
              key={user._id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <span className="font-semibold text-gray-700">{user.name}</span>
                <span className="block text-sm text-gray-500">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                {showDelete && (
                  <button
                    onClick={() => handleDelete(user._id, user.name)}
                    className={`bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition flex items-center gap-1 ${
                      deletingId === user._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    title="Delete User"
                    disabled={deletingId === user._id}
                  >
                    <Trash2 size={16} />
                    {deletingId === user._id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
