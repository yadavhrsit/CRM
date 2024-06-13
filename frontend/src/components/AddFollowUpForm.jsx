import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";
import swal from "sweetalert2";

function AddFollowUpForm({ leadId, setShowAddFollowUpModal }) {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    followDate: "",
    remarks: "",
    assignedTo: "",
    status: "open",
  });

  const [formErrors, setFormErrors] = useState({
    followDate: "",
    remarks: "",
    assignedTo: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users`, {
        headers: { Authorization: `${token}` },
      })
      .then((res) => {
        setUsers(res.data.users);
      });
  }, [token]);

  function handleChange(e) {
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
  }

  const submitFormData = () => {
    axios
      .post(`${BASE_URL}/follow-ups/${leadId}`, formData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(() => {
        swal.fire({
          title: "Follow-Up Added",
          text: "Follow-Up has been added successfully",
          icon: "success",
          timer: 2000,
        });
        setFormData({
          followDate: "",
          remarks: "",
          assignedTo: "",
          status: "open",
        });
        setShowAddFollowUpModal(false);
      })
      .catch((err) => {
        swal.fire({
          title: "Failed to Add Follow-Up",
          text: err.response.data.message,
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    setLoading(true);
    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = `${key} is required`;
      }
    }

    if (formData.status === "closed") {
      swal
        .fire({
          title: "Select Lead Status",
          text: "Lead Status is Closed. Please select Lead Status",
          icon: "warning",
          input: "select",
          inputOptions: {
            won: "Won",
            lost: "Lost",
          },
          inputPlaceholder: "Select Lead Status",
          showCancelButton: true,
        })
        .then((result) => {
          if (result.value) {
            formData.leadStatus = result.value;
            submitFormData();
          } else {
            setLoading(false);
          }
        });
    } else {
      setFormErrors(errors);
      if (Object.keys(errors).length === 0) {
        submitFormData();
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg dark:bg-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center dark:text-gray-100">
        Add Follow-Up
      </h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="followDate"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Follow-Up Date
          </label>
          <input
            type="date"
            name="followDate"
            value={formData.followDate}
            onChange={handleChange}
            required
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.followDate
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          />
          {formErrors.followDate && (
            <span className="text-red-500 text-sm">
              {formErrors.followDate}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="remarks"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            required
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.remarks
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          ></textarea>
          {formErrors.remarks && (
            <span className="text-red-500 text-sm">{formErrors.remarks}</span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="assignedTo"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Assigned To
          </label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.assignedTo
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          {formErrors.assignedTo && (
            <span className="text-red-500 text-sm">
              {formErrors.assignedTo}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300"
          >
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
              formErrors.status
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 dark:focus:ring-blue-400"
            } dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200`}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          {formErrors.status && (
            <span className="text-red-500 text-sm">{formErrors.status}</span>
          )}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-400"
        >
          {loading ? "Adding..." : "Add Follow-Up"}
        </button>
      </form>
    </div>
  );
}

export default AddFollowUpForm;
