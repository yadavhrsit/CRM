import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";

function UserView() {
  const { id } = useParams(); // Extracting user ID from URL params
  const { token } = useAuth();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    mobile: "",
    email: "",
    role: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/${id}`, {
          headers: { Authorization: token },
        });
        setUser(response.data);
        setFormData({
          username: response.data.username,
          name: response.data.name,
          mobile: response.data.mobile,
          email: response.data.email,
          role: response.data.role,
          status: response.data.status,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to fetch user data",
        });
      }
    }

    fetchUserData();
  }, [id, token]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form data to original user data
    setFormData({
      username: user.username,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch(`${BASE_URL}/users/${id}`, formData, {
        headers: { Authorization: token },
      });
      Swal.fire({
        icon: "success",
        title: "User Updated",
        text: "User details updated successfully",
      });
      setEditMode(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update user details",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg dark:bg-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center dark:text-gray-100">
        User Details
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            readOnly={!editMode}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!editMode}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="mobile"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Mobile
          </label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            readOnly={!editMode}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!editMode}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="role"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={!editMode}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={!editMode}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        {editMode ? (
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleEditClick}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
        )}
      </form>
    </div>
  );
}

export default UserView;
