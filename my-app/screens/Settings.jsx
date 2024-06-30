import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { token } = useAuth();
  const [user, setUser] = useState({});
  const [initialUser, setInitialUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    mobile: "",
    email: "",
    funds: 0,
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [unchangedMessage, setUnchangedMessage] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const userData = response.data;
        setUser(userData);
        setInitialUser(userData);
        setFormData({
          username: userData.username,
          name: userData.name,
          mobile: userData.mobile,
          email: userData.email,
          funds: userData.funds,
          password: "",
        });
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch user details");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.username) errors.username = "Username is required";
    if (!data.name) errors.name = "Name is required";
    if (!data.email) errors.email = "Email is required";
    if (data.email && !/\S+@\S+\.\S+/.test(data.email))
      errors.email = "Invalid email address";
    if (!data.mobile) errors.mobile = "Mobile number is required";
    if (data.mobile && !/^\d{10}$/.test(data.mobile))
      errors.mobile = "Mobile number must be 10 digits";
    if (data.password && data.password.length < 6)
      errors.password = "Password must be at least 6 characters long";

    return errors;
  };

  const handleSubmit = async () => {
    setSuccessMessage(null);
    setUnchangedMessage(null);

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Check if form data is unchanged
    if (
      formData.username === initialUser.username &&
      formData.name === initialUser.name &&
      formData.email === initialUser.email &&
      formData.mobile === initialUser.mobile &&
      formData.password === ""
    ) {
      setUnchangedMessage("No changes to update");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        `${BASE_URL}/users/profile`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setUser(response.data);
      setInitialUser(response.data);
      setSuccessMessage("Details updated successfully");
      setFormErrors({});
      setLoading(false);
      Alert.alert("Success", "Details updated successfully");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to update details"
      );
      setLoading(false);
      Alert.alert("Error", error.response?.data?.message || error.message);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 8,
          padding: 16,
          width: "90%",
          maxWidth: 400,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 12,
            textAlign: "center",
            color: "#333333",
          }}
        >
          User Details
        </Text>
        {successMessage && (
          <View
            style={{
              backgroundColor: "#d1e7dd",
              borderWidth: 1,
              borderColor: "#badbcc",
              padding: 10,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#0f5132" }}>{successMessage}</Text>
          </View>
        )}
        {unchangedMessage && (
          <View
            style={{
              backgroundColor: "#fff3cd",
              borderWidth: 1,
              borderColor: "#ffeeba",
              padding: 10,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#856404" }}>{unchangedMessage}</Text>
          </View>
        )}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#374151" }}>Username:</Text>
          <TextInput
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
            editable={false}
          />
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#374151" }}>Name:</Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            style={[
              {
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
              formErrors.name && { borderColor: "#ef4444" },
            ]}
          />
          {formErrors.name && (
            <Text style={{ color: "#ef4444", fontSize: 12 }}>
              {formErrors.name}
            </Text>
          )}
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#374151" }}>Email:</Text>
          <TextInput
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            style={[
              {
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
              formErrors.email && { borderColor: "#ef4444" },
            ]}
          />
          {formErrors.email && (
            <Text style={{ color: "#ef4444", fontSize: 12 }}>
              {formErrors.email}
            </Text>
          )}
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#374151" }}>Mobile:</Text>
          <TextInput
            value={formData.mobile}
            onChangeText={(text) => handleChange("mobile", text)}
            style={[
              {
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
              formErrors.mobile && { borderColor: "#ef4444" },
            ]}
          />
          {formErrors.mobile && (
            <Text style={{ color: "#ef4444", fontSize: 12 }}>
              {formErrors.mobile}
            </Text>
          )}
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: "#374151" }}>Password:</Text>
          <TextInput
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            style={[
              {
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
              formErrors.password && { borderColor: "#ef4444" },
            ]}
          />
          {formErrors.password && (
            <Text style={{ color: "#ef4444", fontSize: 12 }}>
              {formErrors.password}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            title="Update Details"
            onPress={handleSubmit}
            color="#1e40af"
          />
        </View>
      </View>
    </View>
  );
}

export default Settings;
