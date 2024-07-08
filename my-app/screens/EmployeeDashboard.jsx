import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { useColorScheme } from "nativewind";
import DataCard from "../components/DataCard";
import CustomPieChart from "../components/CustomPieChart";
import AddLeadForm from "../components/AddLeadForm";

const EmployeeDashboard = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { notifications } = useNotification();
  const navigation = useNavigation();
  const { token, user } = useAuth();

  const [dashboardData, setDashboardData] = useState({});
  const [leadChartData, setLeadChartData] = useState([]);
  const [leadChartInfo, setLeadChartInfo] = useState({});
  const [userLeadsChartData, setUserLeadsChartData] = useState([]);
  const [userLeadsChartInfo, setUserLeadsChartInfo] = useState({});

  useEffect(() => {
    if (!token) {
      Alert.alert("Access Denied", "You are not authorized to view this page", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    }
  }, [token, navigation]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/dashboard`, {
          headers: { Authorization: token },
        });
        const data = response.data;

        // Ensure data integrity
        const totalLeads = data.totalLeads || 0;
        const openLeadsCount = data.openLeadsCount || 0;
        const lostLeadsCount = data.lostLeadsCount || 0;
        const wonLeadsCount = data.wonLeadsCount || 0;
        const userTotalLeads = data.userTotalLeads || 0;
        const userOpenLeads = data.userOpenLeads || 0;
        const userLostLeadsCount = data.userLostLeadsCount || 0;
        const userWonLeadsCount = data.userWonLeadsCount || 0;

        setDashboardData(data);
        setLeadChartData([
          {
            text: "Open Leads",
            value: openLeadsCount,
            color: "#4caf50",
          },
          {
            text: "Lost Leads",
            value: lostLeadsCount,
            color: "#f44336",
          },
          {
            text: "Won Leads",
            value: wonLeadsCount,
            color: "#2196f3",
          },
        ]);
        setLeadChartInfo({
          title: "Overall Leads",
          totalLeads,
          closedLeadsCount: totalLeads - openLeadsCount,
          openLeadsCount,
        });

        setUserLeadsChartData([
          {
            text: "Open Leads",
            value: userOpenLeads,
            color: "#4caf50",
          },
          {
            text: "Lost Leads",
            value: userLostLeadsCount,
            color: "#f44336",
          },
          {
            text: "Won Leads",
            value: userWonLeadsCount,
            color: "#2196f3",
          },
        ]);

        setUserLeadsChartInfo({
          title: `Leads Created by ${user.name}`,
          totalLeads: userTotalLeads,
          closedLeadsCount: userTotalLeads - userOpenLeads,
          openLeadsCount: userOpenLeads,
        });
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [token, user.name, notifications]);

  return (
    <SafeAreaView className="bg-white dark:bg-black">
      <ScrollView className="px-2 py-4">
        {dashboardData && leadChartData.length !== 0 ? (
          <>
            <View className="px-2 py-6 bg-[#2864ad] dark:bg-zinc-600 rounded-lg mt-4">
              <Text className="text-xl font-bold m-2 text-zinc-100 dark:text-zinc-200">
                All time
              </Text>
              <View className="flex flex-row items-center">
                <DataCard
                  title={"Leads"}
                  value={dashboardData.totalLeads || 0}
                />
                <DataCard
                  title={"Leads Created by you"}
                  value={dashboardData.userTotalLeads || 0}
                />
                <DataCard
                  title={"Upcoming Follow-ups"}
                  value={dashboardData.upcomingFollowUpsCount || 0}
                />
              </View>
              <Text className="text-xl font-bold m-2 text-zinc-100 dark:text-zinc-200 mt-6">
                Today
              </Text>
              <View className="flex flex-row items-center">
                <DataCard
                  title={"Leads created today"}
                  value={dashboardData.todayLeads || 0}
                />
                <DataCard
                  title={"Leads Created by you"}
                  value={dashboardData.todayUserLeads || 0}
                />
                <DataCard
                  title={"Today's Follow-ups"}
                  value={dashboardData.todayFollowUpsCount || 0}
                />
              </View>
            </View>
            <View className="px-2 py-6 bg-slate-50 dark:bg-zinc-600 rounded-lg mt-4">
              <Text className="text-xl font-semibold mt-2 text-zinc-900 dark:text-zinc-200">
                Leads by Source
              </Text>
              {leadChartData.length > 0 && leadChartInfo ? (
                <CustomPieChart
                  pieData={leadChartData}
                  leadChartInfo={leadChartInfo}
                />
              ) : (
                <Text>No lead data available</Text>
              )}
              {userLeadsChartData.length > 0 && userLeadsChartInfo ? (
                <CustomPieChart
                  pieData={userLeadsChartData}
                  leadChartInfo={userLeadsChartInfo}
                />
              ) : (
                <Text>No user lead data available</Text>
              )}
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center h-screen">
            <ActivityIndicator size="large" color="#2763ad" />
            <Text className="text-xl">Loading...</Text>
          </View>
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployeeDashboard;
