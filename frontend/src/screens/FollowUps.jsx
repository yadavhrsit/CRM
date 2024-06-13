import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import AreaTop from "../components/AreaTop";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";

function FollowUps() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages

  useEffect(() => {
    async function fetchData() {
      try {
        if (user.role === "admin") {
          const response = await axios.get(`${BASE_URL}/follow-ups`, {
            headers: { Authorization: token },
            params: { page },
          });
          setFollowUps(response.data.followUps);
          setTotalPages(response.data.pages);
        } else {
          const response = await axios.get(
            `${BASE_URL}/follow-ups/my-follow-ups`,
            {
              headers: { Authorization: token },
              params: { page },
            }
          );
          setFollowUps(response.data.followUps);
          setTotalPages(response.data.pages);
        }
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
    { Header: "Company", accessor: "lead.company.name" },

    {
      Header: "Follow Date",
      accessor: (d) => dayjs(d.followDate).format("DD/MM/YYYY, hh:mm A"),
    },
    { Header: "Remarks", accessor: "remarks" },
    { Header: "Added By", accessor: "addedBy.name" },
    { Header: "Assigned To", accessor: "assignedTo.name" },
    { Header: "Status", accessor: "status" },
    { Header: "Lead Status", accessor: "lead.status" },
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
    console.log(row.original);
    navigate(`/leads/${row.original.lead._id}`, {
      state: { addFollowUp: user.role === "employee" },
    });
  };

  return (
    <div>
      <AreaTop title={"Follow Ups"} showAddLeadBtn={false} />
      {isLoading ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
          <p className="text-xl">Loading...</p>
        </div>
      ) : followUps.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
          <p className="text-xl">No data available to display</p>
        </div>
      ) : (
        <div className="mt-6">
          <DataTable
            data={followUps}
            columns={columns}
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

export default FollowUps;
