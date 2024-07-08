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
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { BASE_URL } from "../constants/api";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AddUserForm from "../components/AddUserForm";

function Users() {
  const { token } = useAuth();
  const { notifications } = useNotification();
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/`, {
          headers: { Authorization: token },
          params: { page, limit: 10 },
        });
        setUsers(response.data.users);
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
  }, [token, page, notifications]);

  const handleRowClick = (user) => {
    navigation.navigate("User Details", {
      id: user._id,
    });
  };

  const handleEnableDisableUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === "enabled" ? "disabled" : "enabled";
    try {
      await axios.patch(
        `${BASE_URL}/users/${userId}`,
        { status: newStatus },
        {
          headers: { Authorization: token },
        }
      );
      // Update the users list after successful update
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      Alert.alert("Success", `User status changed to ${newStatus}`);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to update user status"
      );
    }
  };

  const renderTableHeader = () => (
    <View className="flex-row bg-blue-100 dark:bg-gray-600 p-2">
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 100 }}
      >
        Username
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
        Role
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 150 }}
      >
        Created At
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 150 }}
      >
        Status
      </Text>
      <Text
        className="flex-1 text-center font-bold dark:text-white"
        style={{ width: 150 }}
      >
        Actions
      </Text>
    </View>
  );

  const renderTableRow = (user, index) => (
    <TouchableOpacity
      key={index}
      className={`flex-row p-2 ${
        index % 2 === 0
          ? "bg-white dark:bg-zinc-900"
          : "bg-gray-100 dark:bg-zinc-800"
      }`}
      onPress={() => handleRowClick(user)}
    >
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {user.username}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {user.email}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 100 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {user.role}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {dayjs(user.createdAt).format("DD/MM/YYYY, hh:mm A")}
      </Text>
      <Text
        className="flex-1 text-center dark:text-white"
        style={{ width: 150 }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {user.status}
      </Text>
      <View
        className="flex-1 flex-row justify-center items-center"
        style={{ width: 150 }}
      >
        <Button
          title={user.status === "enabled" ? "Disable" : "Enable"}
          onPress={() => handleEnableDisableUser(user._id, user.status)}
          color={user.status === "enabled" ? "red" : "green"}
        />
        <Button
          title="Update"
          onPress={() => handleRowClick(user)}
          color="blue"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4 pt-6 bg-white dark:bg-black">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2763ad" />
          <Text className="text-xl">Loading...</Text>
        </View>
      ) : users.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl">No data available to display</Text>
        </View>
      ) : (
        <>
          <ScrollView horizontal>
            <View>
              {renderTableHeader()}
              <ScrollView>
                {users.map((user, index) => renderTableRow(user, index))}
              </ScrollView>
            </View>
          </ScrollView>
          <View className="flex-row justify-between items-center mt-4">
            <Button
              title="Previous"
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            />
            <Text className="dark:text-white">
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
      <AddUserForm />
    </View>
  );
}

export default Users;
