import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Picker,
} from "react-native";
import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { BASE_URL } from "../constants/api";

const AdminDashboard = () => {
  const { notifications } = useNotification();
  const { token } = useAuth();

  const [dashboardData, setDashboardData] = useState({});
  const [leadChartData, setLeadChartData] = useState([]);
  const [leadChartInfo, setLeadChartInfo] = useState({});
  const [todayLeadsChartData, setTodayLeadsChartData] = useState([]);
  const [todayLeadsChartInfo, setTodayLeadsChartInfo] = useState({});
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/companies`, {
          headers: { Authorization: token },
        });
        setCompanies(response.data.companies);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchCompanies();
    }

    return () => {
      // Cleanup if necessary
    };
  }, [token]);

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
  };

  const fetchLeads = async () => {
    if (selectedCompany) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/leads/company/${selectedCompany}`,
          {
            headers: { Authorization: token },
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
      // Handle error condition for no selected company
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchLeads();
    }
  }, [selectedCompany, page, notifications]);

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
    
  };
a
  return (
    <View>
      <Text>Admin Dashboard</Text>
    </View>
  );
};


export default AdminDashboard;
