import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import { BASE_URL } from "../constants/api";
import axios from "axios";

function UserView({ route, navigation }) {
  const { token } = useAuth();
  const { id } = route.params;

  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    mobile: "",
    email: "",
    role: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_URL}/users/${id}`, {
          headers: { Authorization: token },
        });
        setUser(response.data);
        setFormData({
          username: response.data.username,
          name: response.data.name,
          mobile: response.data.mobile,
          email: response.data.email,
          role: response.data.role,
          status: response.data.status,
        });
      } catch (error) {
        Alert.alert("Error", "Unable to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, token]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      username: user.username,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`${BASE_URL}/users/${id}`, formData, {
        headers: { Authorization: token },
      });
      Alert.alert("Success", "User details updated successfully");
      setEditMode(false);
      // Optionally, you can re-fetch the user data here to update the UI
    } catch (error) {
      Alert.alert("Error", "Failed to update user details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2763ad" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          User Details
        </Text>
        <View style={{ marginBottom: 10 }}>
          <Text>Username:</Text>
          <TextInput
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
            editable={editMode}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text>Name:</Text>
          <TextInput
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            editable={editMode}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text>Email:</Text>
          <TextInput
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            editable={editMode}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text>Mobile:</Text>
          <TextInput
            value={formData.mobile}
            onChangeText={(value) => handleChange("mobile", value)}
            editable={editMode}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 8,
              borderRadius: 5,
              marginBottom: 10,
            }}
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text>Role:</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor:
                  formData.role === "employee" ? "#2763ad" : "#ccc",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 5,
                marginRight: 10,
              }}
              onPress={() => handleChange("role", "employee")}
              disabled={!editMode}
            >
              <Text style={{ color: "white" }}>Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: formData.role === "admin" ? "#2763ad" : "#ccc",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 5,
              }}
              onPress={() => handleChange("role", "admin")}
              disabled={!editMode}
            >
              <Text style={{ color: "white" }}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text>Status:</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor:
                  formData.status === "enabled" ? "#2763ad" : "#ccc",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 5,
                marginRight: 10,
              }}
              onPress={() => handleChange("status", "enabled")}
              disabled={!editMode}
            >
              <Text style={{ color: "white" }}>Enabled</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor:
                  formData.status === "disabled" ? "#2763ad" : "#ccc",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 5,
              }}
              onPress={() => handleChange("status", "disabled")}
              disabled={!editMode}
            >
              <Text style={{ color: "white" }}>Disabled</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text>Created At:</Text>
          <Text>
            {user.createdAt &&
              dayjs(user.createdAt).format("DD-MM-YYYY HH:mm A")}
          </Text>
        </View>
      </View>
      {editMode ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "#2763ad",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 5,
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white" }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancelEdit}
            style={{
              backgroundColor: "#ccc",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 5,
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleEditClick}
          style={{
            backgroundColor: "#2763ad",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "white",textAlign:"center" }}>Edit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

export default UserView;
