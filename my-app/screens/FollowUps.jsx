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

function FollowUps() {
  const { token, user } = useAuth();
  const { notifications } = useNotification();
  const navigation = useNavigation();

  const [followUps, setFollowUps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages

  useEffect(() => {
    async function fetchData() {
      try {
        let url = `${BASE_URL}/follow-ups`;
        if (user.role !== "admin") {
          url = `${BASE_URL}/follow-ups/my-follow-ups`;
        }

        const response = await axios.get(url, {
          headers: { Authorization: token },
          params: { page },
        });
        setFollowUps(response.data.followUps);
        setTotalPages(response.data.pages);
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
  }, [token, page, notifications, user]);

  const handleRowClick = (followUp) => {
    navigation.navigate("LeadDetails", {
      id: followUp.lead._id,
      addFollowUp: user.role === "employee",
    });
  };

  const renderTableHeader = () => (
    <View className="flex-row bg-blue-100 p-2">
      <Text className="flex-1 text-center font-bold" style={{ width: 100 }}>
        Company
      </Text>
      <Text className="flex-1 text-center font-bold" style={{ width: 150 }}>
        Follow Date
      </Text>
      <Text className="flex-1 text-center font-bold" style={{ width: 300 }}>
        Remarks
      </Text>
      <Text className="flex-1 text-center font-bold" style={{ width: 100 }}>
        Added By
      </Text>
      <Text className="flex-1 text-center font-bold" style={{ width: 150 }}>
        Assigned To
      </Text>
      <Text className="flex-1 text-center font-bold" style={{ width: 100 }}>
        Status
      </Text>
      <Text className="flex-1 text-center font-bold" style={{ width: 100 }}>
        Lead Status
      </Text>
    </View>
  );


  const renderTableRow = (followUp, index) => (
    <TouchableOpacity
      key={index}
      className={`flex-row p-2 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
      onPress={() => handleRowClick(followUp)}
    >
      <Text
        className="flex-1 text-center"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {followUp.lead.company.name}
      </Text>
      <Text
        className="flex-1 text-center"
        style={{ width: 200 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {dayjs(followUp.followDate).format("DD/MM/YYYY")}
      </Text>
      <Text
        className="flex-1 text-center"
        style={{ width: 300 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {followUp.remarks}
      </Text>
      <Text
        className="flex-1 text-center"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {followUp.addedBy.name}
      </Text>
      <Text
        className="flex-1 text-center"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {followUp.assignedTo.name}
      </Text>
      <Text
        className="flex-1 text-center"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {followUp.status}
      </Text>
      <Text
        className="flex-1 text-center"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {followUp.lead.status}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 pt-6 bg-white">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-xl">Loading...</Text>
        </View>
      ) : followUps.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl">No data available to display</Text>
        </View>
      ) : (
        <>
          <ScrollView horizontal>
            <View>
              {renderTableHeader()}
              <ScrollView>
                {followUps.map((followup, index) =>
                  renderTableRow(followup, index)
                )}
              </ScrollView>
            </View>
          </ScrollView>
          <View className="flex-row justify-between items-center mt-4">
            <Button
              title="Previous"
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            />
            <Text>
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



export default FollowUps;
