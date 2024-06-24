import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";
import swal from "sweetalert2";

function AddLeadForm() {
  const { token } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    mobile: "",
    query: "",
  });

  const [formErrors, setFormErrors] = useState({
    company: "",
    name: "",
    email: "",
    mobile: "",
    query: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    if (e.target.name === "company") {
      const response = axios.get(`${BASE_URL}/companies`, {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          search: e.target.value,
        },
      });
      response.then((res) => {
        setCompanies(res.data.companies);
      });
      setFormData({
        ...formData,
        company: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }

    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    setLoading(true);
    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = `${key} is required`;
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    axios
      .post(`${BASE_URL}/leads`, formData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(() => {
        swal.fire({
          title: "Lead Added",
          text: "Lead has been added successfully",
          icon: "success",
          timer: 2000,
        });
        setFormData({
          company: "",
          name: "",
          email: "",
          mobile: "",
          query: "",
        });
        
      })
      .catch((err) => {
        swal.fire({
          title: "Failed to Add Lead",
          text: err.response.data.message,
          icon: "error",
          timer: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg dark:bg-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center dark:text-gray-100">
        Add Lead
      </h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="company"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            list="companies"
            required
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.company
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          />
          {formErrors.company && (
            <span className="text-red-500 text-sm">{formErrors.company}</span>
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
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
            htmlFor="email"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            htmlFor="mobile"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Mobile
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
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
            htmlFor="query"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Query
          </label>
          <textarea
            name="query"
            value={formData.query}
            onChange={handleChange}
            required
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.query
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          ></textarea>
          {formErrors.query && (
            <span className="text-red-500 text-sm">{formErrors.query}</span>
          )}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
        >
          {loading ? "Adding..." : "Add Lead"}
        </button>
      </form>
      <datalist id="companies">
        {companies.map((company) => (
          <option key={company._id} value={company.name}>
            {company.name}
          </option>
        ))}
      </datalist>
    </div>
  );
}

export default AddLeadForm;
