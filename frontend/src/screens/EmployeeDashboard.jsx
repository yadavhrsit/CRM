import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../constants/api";
import axios from "axios";

import AreaTop from "../components/AreaTop";
import DataCard from "../components/DataCard";
import { MdPerson, MdEvent, MdAddCircle, MdAlarm } from "react-icons/md";
import CustomPieChart from "../components/PieChart";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You are not authorized to view this page",
    }).then(() => navigate("/login"));
  }

  const [dashboardData, setDashboardData] = useState({});
  const [leadChartData, setLeadChartData] = useState([]);
  const [leadChartInfo, setLeadChartInfo] = useState({});
  const [userLeadsChartData, setUserLeadsChartData] = useState([]);
  const [userLeadsChartInfo, setUserLeadsChartInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/dashboard`, {
          headers: { Authorization: token },
        });
        setDashboardData(response.data);
        setLeadChartData([
          {
            name: "Closed Leads",
            value: response.data.closedLeadsCount || 0,
            color: "#4caf50",
          },
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
          openLeadsCount:
            response.data.totalLeads - response.data.closedLeadsCount,
        });

        setUserLeadsChartData([
          {
            name: "Closed Leads",
            value: response.data.userClosedLeads || 0,
            color: "#4caf50",
          },
          {
            name: "Lost Leads",
            value: response.data.userLostLeadsCount || 0,
            color: "#f44336",
          },
          {
            name: "Won Leads",
            value: response.data.userWonLeadsCount || 0,
            color: "#2196f3",
          },
        ]);

        setUserLeadsChartInfo({
          title: `Leads Created by ${user.name}`,
          totalLeads: response.data.userTotalLeads,
          closedLeadsCount: response.data.userClosedLeads,
          openLeadsCount:
            response.data.userTotalLeads - response.data.userClosedLeads,
        });

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [token,user.name]);

  return (
    <div>
      <AreaTop title={"Dashboard"} showAddLeadBtn={true}/>
      <section
        id="data-card"
        className="px-2 py-6 bg-slate-50 dark:bg-zinc-600 rounded-lg mt-4"
      >
        <h2 className="text-xl font-semibold m-2 text-zinc-900 dark:text-zinc-200">
          All time
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <DataCard
            title={"Leads"}
            value={dashboardData.totalLeads}
            icon={MdAddCircle}
            color={"#F15757"}
          />
          <DataCard
            title={"Leads Created by you"}
            value={dashboardData.userTotalLeads}
            icon={MdPerson}
            color={"#2DA55C"}
          />
          <DataCard
            title={"Upcoming Follow-ups"}
            value={dashboardData.upcomingFollowUpsCount}
            icon={MdAlarm}
            color={"#5E8AEA"}
          />
        </div>
        <h2 className="text-xl font-semibold m-2 text-zinc-900 dark:text-zinc-200 mt-6">
          Today
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <DataCard
            title={"Leads created today"}
            value={dashboardData.todayLeads}
            icon={MdAddCircle}
            color={"#F15757"}
          />
          <DataCard
            title={"Leads Created by you"}
            value={dashboardData.todayUserLeads}
            icon={MdPerson}
            color={"#2DA55C"}
          />
          <DataCard
            title={"Today's Follow-ups"}
            value={dashboardData.todayFollowUpsCount}
            icon={MdEvent}
            color={"#5E8AEA"}
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
              pieData={userLeadsChartData}
              infoData={userLeadsChartInfo}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default EmployeeDashboard;
