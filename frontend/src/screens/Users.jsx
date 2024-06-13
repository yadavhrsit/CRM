import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import AreaTop from "../components/AreaTop";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import AddUserForm from "../components/AddUserForm";
import { useNavigate } from "react-router-dom";

function Users() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/`, {
          headers: { Authorization: token },
          params: { page, limit: 10 },
        });
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages); // Set total pages
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong!",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token, page]); // Fetch data when token or page changes

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "User Name", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Mobile", accessor: "mobile" },
    { Header: "Role", accessor: "role" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Added At",
      accessor: (d) => dayjs(d.createdAt).format("DD/MM/YYYY, hh:mm A"),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div>
          <button
            onClick={() =>
              handleEnableDisableUser(row.original._id, row.original.status)
            }
            className={`px-2 py-1 rounded-md text-sm font-semibold ${
              row.original.status === "enabled"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            } hover:bg-opacity-80 focus:outline-none`}
          >
            {row.original.status === "enabled" ? "Disable" : "Enable"}
          </button>
          <button
            onClick={() => handleUpdateUser(row.original._id)}
            className="ml-2 px-2 py-1 rounded-md text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          >
            Update
          </button>
        </div>
      ),
    },
  ];

  const handleEnableDisableUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === "enabled" ? "disabled" : "enabled";
    try {
      await axios.patch(
        `${BASE_URL}/users/${userId}`,
        { status: newStatus },
        {
          headers: { Authorization: token },
        }
      );
      // Update the users list after successful update
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      Swal.fire({
        icon: "success",
        title: "User Status Updated",
        text: `User status changed to ${newStatus}`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update user status",
      });
    }
  };

  const handleUpdateUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  return (
    <div>
      <div className="flex gap-5">
        <AreaTop title={"Users"} />
        <button
          className="px-4 py-2 rounded-md text-lg xl:text-xl font-semibold transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-500 text-white hover:bg-blue-600 focus:ring-offset-white "
          onClick={() => setShowAddUserModal(true)}
        >
          Add User
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
          <p className="text-xl">Loading...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
          <p className="text-xl">No data available to display</p>
        </div>
      ) : (
        <div className="mt-6">
          <DataTable
            data={users}
            columns={columns}
            pageIndex={page - 1} // Pass the current page index
            canPreviousPage={page > 1} // Check if there is a previous page
            canNextPage={page < totalPages} // Check if there is a next page
            nextPage={handleNextPage} // Pass the function to go to the next page
            previousPage={handlePreviousPage} // Pass the function to go to the previous page
          />
          <div className="flex justify-between p-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
            >
              Previous Page
            </button>
            <div className="py-2 px-4 font-semibold text-black dark:text-white">
              Page{" "}
              <em>
                {page} of {totalPages}
              </em>
            </div>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
            >
              Next Page
            </button>
          </div>
        </div>
      )}
      {showAddUserModal && (
        <Modal
          show={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
        >
          <AddUserForm setShowAddUserModal={setShowAddUserModal} />
        </Modal>
      )}
    </div>
  );
}

export default Users;
