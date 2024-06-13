import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";

function AddUserForm({ setshowAddUserModal }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    mobile: "",
    email: "",
    role: "employee", // Default role
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    name: "",
    mobile: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/users/`, formData, {
        headers: { Authorization: token },
      });
      Swal.fire({
        icon: "success",
        title: "User Created",
        text: "User has been created successfully",
      });

      setFormData({
        username: "",
        password: "",
        name: "",
        mobile: "",
        email: "",
        role: "employee",
      });
      setshowAddUserModal(false);
    } catch (error) {
      console.error("Error creating user:", error.response);
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const errorMessages = {};
        for (const key in errors) {
          errorMessages[key] = errors[key].message;
        }
        setFormErrors(errorMessages);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Create User",
          text: "An error occurred while creating the user",
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg dark:bg-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center dark:text-gray-100">
        Add User
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
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.username
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          />
          {formErrors.username && (
            <span className="text-red-500 text-sm">{formErrors.username}</span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.password
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          />
          {formErrors.password && (
            <span className="text-red-500 text-sm">{formErrors.password}</span>
          )}
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
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.name
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          />
          {formErrors.name && (
            <span className="text-red-500 text-sm">{formErrors.name}</span>
          )}
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
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.mobile
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          />
          {formErrors.mobile && (
            <span className="text-red-500 text-sm">{formErrors.mobile}</span>
          )}
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
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.email
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          />
          {formErrors.email && (
            <span className="text-red-500 text-sm">{formErrors.email}</span>
          )}
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
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.role
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          {formErrors.role && (
            <span className="text-red-500 text-sm">{formErrors.role}</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
        >
          Add User
        </button>
      </form>
    </div>
  );
}

export default AddUserForm;
