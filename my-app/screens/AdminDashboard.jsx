import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import dayjs from "dayjs";
import DataCard from "../components/DataCard";
import CustomPieChart from "../components/CustomPieChart";
import AddUserForm from "../components/AddUserForm";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { BASE_URL } from "../constants/api";
import { useNavigation } from "@react-navigation/native";
import AddLeadForm from "../components/AddLeadForm";

const AdminDashboard = () => {
  const { notifications } = useNotification();
  const { token } = useAuth();
  const navigation = useNavigation();

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

  // State for Modal
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/admin/dashboard`, {
          headers: { Authorization: token },
        });
        setDashboardData(response.data);
        setLeadChartData([
          {
            text: "Lost Leads",
            value: response.data.lostLeadsCount || 0,
            color: "#f44336",
          },
          {
            text: "Won Leads",
            value: response.data.wonLeadsCount || 0,
            color: "#2196f3",
          },
          {
            text: "Open Leads",
            value: response.data.openLeadsCount || 0,
            color: "#2196f3",
          },
        ]);
        setLeadChartInfo({
          title: "Overall Leads",
          totalLeads: response.data.totalLeads,
          closedLeadsCount: response.data.closedLeadsCount,
          openLeadsCount: response.data.openLeadsCount,
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
      Alert.alert(
        "No Company Selected",
        "Please select a company to view its leads"
      );
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

  const handleRowClick = (lead) => {
    navigation.navigate("Lead Details", {
      id: lead._id,
      addFollowUp: lead.followUps.length === 0,
    });
  };

  const renderTableHeader = () => (
    <View className="flex-row bg-blue-100 dark:bg-gray-600 p-2">
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 100 }}
      >
        Company
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 100 }}
      >
        Name
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 150 }}
      >
        Email
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 100 }}
      >
        Mobile
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 150 }}
      >
        Query
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 100 }}
      >
        Status
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 100 }}
      >
        Added By
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 150 }}
      >
        Added At
      </Text>
    </View>
  );

  const renderTableRow = (lead, index) => (
    <TouchableOpacity
      key={index}
      className={`flex-row p-2 ${
        index % 2 === 0
          ? "bg-white dark:bg-zinc-900"
          : "bg-gray-100 dark:bg-zinc-800"
      }`}
      onPress={() => handleRowClick(lead)}
    >
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {lead.company.name}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {lead.name}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {lead.email}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {lead.mobile}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {lead.query}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {lead.status}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {lead.addedBy.name}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {dayjs(lead.createdAt).format("DD/MM/YYYY, hh:mm A")}
      </Text>
    </TouchableOpacity>
  );

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
                  title={"Total Follow-ups"}
                  value={dashboardData.totalFollowUps || 0}
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
                  title={"Today Follow-Ups"}
                  value={dashboardData.todayFollowUps || 0}
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
            </View>
            <View className="px-2 py-6 bg-slate-50 dark:bg-zinc-600 rounded-lg mt-4">
              <Text className="text-xl font-semibold my-2 text-zinc-900 dark:text-zinc-200">
                Select Company
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  marginBottom: 15,
                }}
                onPress={() => setShowCompanyPicker(true)}
              >
                <Text className="text-zinc-900 dark:text-zinc-200">
                  {selectedCompany
                    ? companies.find((c) => c._id === selectedCompany)?.name ||
                      "Select Company"
                    : "Select Company"}
                </Text>
              </TouchableOpacity>
              <Modal
                transparent={true}
                visible={showCompanyPicker}
                onRequestClose={() => setShowCompanyPicker(false)}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <View
                    style={{
                      width: "80%",
                      backgroundColor: "white",
                      borderRadius: 10,
                      padding: 20,
                    }}
                  >
                    <Picker
                      selectedValue={selectedCompany}
                      onValueChange={(value) => {
                        handleCompanyChange(value);
                      }}
                    >
                      <Picker.Item label="Select Company" value="" />
                      {companies.map((company) => (
                        <Picker.Item
                          key={company._id}
                          label={company.name}
                          value={company._id}
                        />
                      ))}
                    </Picker>
                    <Pressable
                      style={{
                        backgroundColor: "#2196F3",
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                        alignItems: "center",
                      }}
                      onPress={() => setShowCompanyPicker(false)}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Done
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color="#2763ad" />
                  <Text style={{ fontSize: 20 }}>Loading...</Text>
                </View>
              ) : leads.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: 20 }}
                    className="text-zinc-900 dark:text-zinc-200 pb-4"
                  >
                    No data available to display
                  </Text>
                </View>
              ) : (
                <>
                  <ScrollView horizontal>
                    <View>
                      {renderTableHeader()}
                      <ScrollView>
                        {leads.map((lead, index) =>
                          renderTableRow(lead, index)
                        )}
                      </ScrollView>
                    </View>
                  </ScrollView>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Button
                      title="Previous"
                      onPress={handlePreviousPage}
                      disabled={page === 1}
                    />
                    <Text className="text-black dark:text-white">
                      Page {page} of {totalPages}
                    </Text>
                    <Button
                      title="Next"
                      onPress={handleNextPage}
                      disabled={page === totalPages}
                    />
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#2763ad" />
            <Text style={{ fontSize: 20 }}>Loading...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;
