import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import dayjs from "dayjs";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

function Leads() {
  const { token } = useAuth();
  const { notifications } = useNotification();
  const navigation = useNavigation();

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
        Alert.alert(
          "Error",
          error.response?.data?.message || "Something went wrong!"
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token, page, notifications]); // Fetch data when token or page changes

  const handleRowClick = (lead) => {
    navigation.navigate("Lead Details", {
      id: lead._id,
      addFollowUp:
        lead.followUps.length === 0 ,
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
    <View className="flex-1 p-4 pt-6 bg-white dark:bg-black">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2763ad" />
          <Text className="text-xl">Loading...</Text>
        </View>
      ) : leads.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl">No data available to display</Text>
        </View>
      ) : (
        <>
          <ScrollView horizontal>
            <View>
              {renderTableHeader()}
              <ScrollView>
                {leads.map((lead, index) => renderTableRow(lead, index))}
              </ScrollView>
            </View>
          </ScrollView>
          <View className="flex-row justify-between items-center mt-4">
            <Button
              title="Previous"
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            />
            <Text className="text-black dark:text-white">
              Page {page} of {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            />
          </View>
        </>
      )}
    </View>
  );
}

export default Leads;
