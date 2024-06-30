import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants";
import { BASE_URL } from "../constants/api";

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { identifier, password } = formData;

    if (!identifier && !password) {
      setError("Both fields are required.");
      return;
    }

    if (!identifier) {
      setError("Please Enter Username/Email/Phone");
      return;
    }
    if (!password) {
      setError("Please Enter your password");
      return;
    }


    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        login(data.token, data.user);
        setSuccess("Sign In successful.");

      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const isDarkTheme = theme === DARK_THEME;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "#000" : "#008dff" },
      ]}
    >
      <StatusBar style={isDarkTheme ? "light" : "dark"} />
      <Text style={[styles.title, { color: isDarkTheme ? "#FFF" : "#FFF" }]}>
        Login to Account
      </Text>
      <Text style={[styles.subtitle, { color: isDarkTheme ? "#FFF" : "#FFF" }]}>
        Please enter your email and password to continue
      </Text>

      <View
        style={[
          styles.form,
          { backgroundColor: isDarkTheme ? "#333" : "#FFF" },
        ]}
      >
        <Text style={[styles.label, { color: isDarkTheme ? "#FFF" : "#333" }]}>
          Email/Username/Phone:
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDarkTheme ? "#555" : "#FFF",
              color: isDarkTheme ? "#FFF" : "#000",
            },
          ]}
          placeholder="Enter email, username, or phone"
          placeholderTextColor={isDarkTheme ? "#CCC" : "#999"}
          value={formData.identifier}
          onChangeText={(text) => handleInputChange("identifier", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: isDarkTheme ? "#FFF" : "#333" }]}>
          Password:
        </Text>
        <View
          style={[
            styles.passwordInput,
            { backgroundColor: isDarkTheme ? "#555" : "#FFF" },
          ]}
        >
          <TextInput
            style={[
              styles.passwordField,
              { color: isDarkTheme ? "#FFF" : "#000" },
            ]}
            secureTextEntry={!showPassword}
            placeholder="Enter your password"
            placeholderTextColor={isDarkTheme ? "#CCC" : "#999"}
            value={formData.password}
            onChangeText={(text) => handleInputChange("password", text)}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text
              style={[
                styles.passwordVisibility,
                { color: isDarkTheme ? "#FFF" : "#333" },
              ]}
            >
              {showPassword ? "👁️" : "🔒"}
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkTheme ? "#666" : "#3B82F6" },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  form: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
  },
  passwordField: {
    flex: 1,
    fontSize: 16,
  },
  passwordVisibility: {
    marginLeft: 10,
    fontSize: 18,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "#FF0000",
    marginTop: 4,
    textAlign: "center",
  },
  success: {
    color: "#00FF00",
    marginTop: 4,
    textAlign: "center",
  },
});

export default Login;
