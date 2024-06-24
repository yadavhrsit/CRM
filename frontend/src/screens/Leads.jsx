import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import AreaTop from "../components/AreaTop";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

function Leads() {
  const { token } = useAuth();

  const navigate = useNavigate();

  const { notifications } = useNotification();

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/leads/`, {
          headers: { Authorization: token },
          params: { page },
        });
        setLeads(response.data.docs);
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
  }, [token, page, notifications]); // Fetch data when token or page changes

  const columns = [
    { Header: "Company", accessor: "company.name" },
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Mobile", accessor: "mobile" },
    { Header: "Query", accessor: "query" },
    { Header: "Status", accessor: "status" },
    { Header: "Added By", accessor: "addedBy.name" },
    {
      Header: "Added At",
      accessor: (d) => dayjs(d.createdAt).format("DD/MM/YYYY, hh:mm A"),
    },
  ];

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

  const handleRowClick = (row) => {
    navigate(`/leads/${row.original._id}`, {
      state: { addFollowUp: (row.original.followUps.length === 0) },
    });
  };

  return (
    <div>
      <AreaTop title={"Leads"} />
      {isLoading ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
          <p className="text-xl">Loading...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
          <p className="text-xl">No data available to display</p>
        </div>
      ) : (
        <div className="mt-6">
          <DataTable
            data={leads}
            columns={columns}
            pageIndex={page - 1} // Pass the current page index
            canPreviousPage={page > 1} // Check if there is a previous page
            canNextPage={page < totalPages} // Check if there is a next page
            nextPage={handleNextPage} // Pass the function to go to the next page
            previousPage={handlePreviousPage} // Pass the function to go to the previous page
            handleRowClick={handleRowClick} 
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
    </div>
  );
}

export default Leads;
