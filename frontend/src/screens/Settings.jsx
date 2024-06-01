import  { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import AreaTop from "../components/AreaTop";
import swal from "sweetalert2";

function Settings() {
  const [user, setUser] = useState({});
  const [initialUser, setInitialUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    funds: 0,
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [unchangedMessage, setUnchangedMessage] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("saving_up_token");
        const response = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setUser(userData);
        setInitialUser(userData);
        setFormData({
          name: userData.username,
          email: userData.email,
          funds: userData.funds,
          password: "",
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.name) errors.name = "Name is required";
    if (!data.email) errors.email = "Email is required";
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) errors.email = "Invalid email address";
    if (data.funds && isNaN(data.funds)) errors.funds = "Funds must be a number";
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
      formData.name === initialUser.username &&
      formData.email === initialUser.email &&
      formData.funds === initialUser.funds &&
      formData.password === ""
    ) {
      setUnchangedMessage("No changes to update");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("saving_up_token");
      const response = await axios.put(
        `${BASE_URL}/api/user/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.data);
      setInitialUser(response.data.data);
      setSuccessMessage("Details updated successfully");
      setFormErrors({});
      setLoading(false);
      swal.fire("Success", "Details updated successfully", "success");
    } catch (error) {
      setError(error.response.data.message || error.message);
      setLoading(false);
      swal.fire("Error", error.response.data.message || error.message, "error");
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
                Funds:
              </label>
              <input
                type="number"
                name="funds"
                value={formData.funds}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.funds
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-400"
                }`}
              />
              {formErrors.funds && (
                <div className="text-red-500 text-sm mt-1">
                  {formErrors.funds}
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
