import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../constants/api";
import axios from "axios";

import AreaTop from "../components/AreaTop";
import DataCard from "../components/DataCard";
import { MdPerson, MdEvent, MdAddCircle, MdAlarm } from "react-icons/md";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  if (!token || user.role !== "employee") {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: "You are not authorized to view this page",
    }).then(() => navigate("/login"));
  }

  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/dashboard`, {
          headers: { Authorization: token },
        });
        setDashboardData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div>
      <AreaTop title={"Dashboard"} />
      <div className="px-2 py-6 bg-slate-50 dark:bg-zinc-600 rounded-lg mt-4">
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
      </div>
    </div>
  );
}

export default EmployeeDashboard;
