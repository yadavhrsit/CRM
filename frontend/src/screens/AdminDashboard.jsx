import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../constants/api";
import DataTable from "../components/DataTable";
import axios from "axios";
import dayjs from "dayjs";
import AreaTop from "../components/AreaTop";
import DataCard from "../components/DataCard";
import { MdPerson, MdAddCircle } from "react-icons/md";
import CustomPieChart from "../components/PieChart";

function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const [dashboardData, setDashboardData] = useState({});
  const [leadChartData, setLeadChartData] = useState([]);
  const [leadChartInfo, setLeadChartInfo] = useState({});
  const [todayLeadsChartData, setTodayLeadsChartData] = useState([]);
  const [todayLeadsChartInfo, setTodayLeadsChartInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/admin/dashboard`, {
          headers: { Authorization: token },
        });
        setDashboardData(response.data);
        setLeadChartData([
          {
            name: "Lost Leads",
            value: response.data.lostLeadsCount || 0,
            color: "#f44336",
          },
          {
            name: "Won Leads",
            value: response.data.wonLeadsCount || 0,
            color: "#2196f3",
          },
        ]);
        setLeadChartInfo({
          title: "Overall Leads",
          totalLeads: response.data.totalLeads,
          closedLeadsCount: response.data.closedLeadsCount,
          openLeadsCount: response.data.openLeadsCount,
        });

        setTodayLeadsChartData([
          {
            name: "Lost Leads",
            value: response.data.todayLostLeads || 0,
            color: "#f44336",
          },
          {
            name: "Won Leads",
            value: response.data.todayWonLeads || 0,
            color: "#2196f3",
          },
        ]);

        setTodayLeadsChartInfo({
          title: "Today Leads",
          closedLeadsCount: response.data.todayClosedLeads,
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You are not authorized to view this page",
      }).then(() => navigate("/login"));
    } else {
      fetchCompanies();
    }
  }, [token, navigate]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/companies`, {
        headers: { Authorization: `${token}` },
      });
      setCompanies(response.data.companies);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const fetchLeads = async () => {
    if (selectedCompany) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/leads/company/${selectedCompany}`,
          {
            headers: { Authorization: `${token}` },
            params: { page },
          }
        );
        setLeads(response.data.leads);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "No Company Selected",
        text: "Please select a company to view its leads",
      });
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchLeads();
    }
  }, [selectedCompany, page]);

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
      state: { addFollowUp: row.original.followUps.length === 0 },
    });
  };

  return (
    <div className="">
      <AreaTop title={"Admin Dashboard"} />
      <section
        id="data-card"
        className="px-2 py-6 bg-slate-50 dark:bg-zinc-600 rounded-lg mt-4"
      >
        <h2 className="text-xl font-semibold m-2 text-zinc-900 dark:text-zinc-200">
          All time
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <DataCard
            title={"Leads"}
            value={dashboardData.totalLeads}
            icon={MdAddCircle}
            color={"#F15757"}
          />
          <DataCard
            title={"Total Follow-ups"}
            value={dashboardData.totalFollowUps}
            icon={MdPerson}
            color={"#2DA55C"}
          />
          
        </div>
        <h2 className="text-xl font-semibold m-2 text-zinc-900 dark:text-zinc-200 mt-6">
          Today
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <DataCard
            title={"Leads created today"}
            value={dashboardData.todayLeads}
            icon={MdAddCircle}
            color={"#F15757"}
          />
          <DataCard
            title={"Today Follow-ups"}
            value={dashboardData.todayFollowUps}
            icon={MdPerson}
            color={"#2DA55C"}
          />
          
        </div>
      </section>
      <section
        id="data-chart"
        className="px-2 py-6 bg-slate-50 dark:bg-zinc-600 rounded-lg mt-4"
      >
        <h2 className="text-xl font-semibold m-2 text-zinc-900 dark:text-zinc-200">
          Leads by Source
        </h2>
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <CustomPieChart pieData={leadChartData} infoData={leadChartInfo} />
            <CustomPieChart
              pieData={todayLeadsChartData}
              infoData={todayLeadsChartInfo}
            />
          </div>
        )}
      </section>
      <div className="my-4">
        <label
          htmlFor="company"
          className="block font-medium text-gray-700 dark:text-gray-200 my-2 text-lg"
        >
          Select Company:
        </label>
        <select
          id="company"
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-sm dark:bg-slate-600 dark:text-white border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg rounded-md"
        >
          <option value="">--Select a company--</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id} className="text-lg">
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
            <p className="text-xl">Loading...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 text-gray-500">
            <p className="text-xl">
              {selectedCompany === ""
                ? "Select a company to display leads"
                : "No leads to display"}
            </p>
          </div>
        ) : (
          <div className="mt-6">
            <DataTable
              data={leads}
              columns={columns}
              pageIndex={page - 1}
              canPreviousPage={page > 1}
              canNextPage={page < totalPages}
              nextPage={handleNextPage}
              previousPage={handlePreviousPage}
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
    </div>
  );
}

export default AdminDashboard;
