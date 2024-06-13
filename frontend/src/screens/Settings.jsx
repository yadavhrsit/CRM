import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import AreaTop from "../components/AreaTop";
import swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { token } = useAuth();
  const [user, setUser] = useState({});
  const [initialUser, setInitialUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    mobile: "",
    email: "",
    funds: 0,
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [unchangedMessage, setUnchangedMessage] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const userData = response.data;
        setUser(userData);
        setInitialUser(userData);
        setFormData({
          username: userData.username,
          name: userData.name,
          mobile: userData.mobile,
          email: userData.email,
          funds: userData.funds,
          password: "",
        });
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch user details");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.username) errors.username = "Username is required";
    if (!data.name) errors.name = "Name is required";
    if (!data.email) errors.email = "Email is required";
    if (data.email && !/\S+@\S+\.\S+/.test(data.email))
      errors.email = "Invalid email address";
    if (!data.mobile) errors.mobile = "Mobile number is required";
    if (data.mobile && !/^\d{10}$/.test(data.mobile))
      errors.mobile = "Mobile number must be 10 digits";
    if (data.password && data.password.length < 6)
      errors.password = "Password must be at least 6 characters long";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setUnchangedMessage(null);

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Check if form data is unchanged
    if (
      formData.username === initialUser.username &&
      formData.name === initialUser.name &&
      formData.email === initialUser.email &&
      formData.mobile === initialUser.mobile &&
      formData.password === ""
    ) {
      setUnchangedMessage("No changes to update");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        `${BASE_URL}/users/profile`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setUser(response.data);
      setInitialUser(response.data);
      setSuccessMessage("Details updated successfully");
      setFormErrors({});
      setLoading(false);
      swal.fire("Success", "Details updated successfully", "success");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update details"
      );
      setLoading(false);
      swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };

  if (loading)
    return (
      <>
        <AreaTop title={"Settings"} />
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      </>
    );

  if (error)
    return (
      <>
        <AreaTop title={"Settings"} />
        <div className="flex items-center justify-center h-screen">
          Error: {error}
        </div>
      </>
    );

  return (
    <>
      <AreaTop title={"Settings"} />
      <div className="flex items-center justify-center mt-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
            User Details
          </h1>
          {successMessage && (
            <div
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
              role="alert"
            >
              <p>{successMessage}</p>
            </div>
          )}
          {unchangedMessage && (
            <div
              className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
              role="alert"
            >
              <p>{unchangedMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Username:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {formErrors.name && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.name}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {formErrors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.email}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Mobile:
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.mobile
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {formErrors.mobile && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.mobile}
                </div>
              )}
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Password:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {formErrors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.password}
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Update Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Settings;
