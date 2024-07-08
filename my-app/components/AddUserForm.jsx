import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";
import { AddUserContext } from "../context/AddUserContext";

function AddUserForm() {
  const { token } = useAuth();
  const { addUser, toggleAddUser } = useContext(AddUserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    mobile: "",
    email: "",
    role: "employee", // Default role
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    // Name validation
    if (!formData.name) errors.name = "Name is required";

    // Mobile validation
    if (!formData.mobile) {
      errors.mobile = "Mobile is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/users/`, formData, {
        headers: { Authorization: token },
      });
      alert("User Created. User has been created successfully");

      setFormData({
        username: "",
        password: "",
        name: "",
        mobile: "",
        email: "",
        role: "employee",
      });
      toggleAddUser(false);
    } catch (error) {
      console.error("Error creating user:", error.response);
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const errorMessages = {};
        for (const key in errors) {
          errorMessages[key] = errors[key].message;
        }
        setFormErrors(errorMessages);
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Failed to Create User: ${error.response.data.message}`);
      } else {
        alert(
          "Failed to Create User. An error occurred while creating the user"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    toggleAddUser(false);
    setFormData({
      username: "",
      password: "",
      name: "",
      mobile: "",
      email: "",
      role: "employee",
    });
    setFormErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={addUser}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Add User</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, formErrors.username && styles.errorInput]}
                value={formData.username}
                onChangeText={(value) => handleChange("username", value)}
              />
              {formErrors.username && (
                <Text style={styles.errorText}>{formErrors.username}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, formErrors.password && styles.errorInput]}
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
                secureTextEntry
              />
              {formErrors.password && (
                <Text style={styles.errorText}>{formErrors.password}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, formErrors.name && styles.errorInput]}
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
              />
              {formErrors.name && (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={[styles.input, formErrors.mobile && styles.errorInput]}
                value={formData.mobile}
                onChangeText={(value) => handleChange("mobile", value)}
              />
              {formErrors.mobile && (
                <Text style={styles.errorText}>{formErrors.mobile}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, formErrors.email && styles.errorInput]}
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
              />
              {formErrors.email && (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleChange("role", "employee")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      formData.role === "employee" && styles.selectedRadio,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Employee</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => handleChange("role", "admin")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      formData.role === "admin" && styles.selectedRadio,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Admin</Text>
                </TouchableOpacity>
              </View>
              {formErrors.role && (
                <Text style={styles.errorText}>{formErrors.role}</Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleCloseModal}
                disabled={loading}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSubmit]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textStyle}>Add User</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: "#333",
  },
  radioLabel: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 6,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonClose: {
    backgroundColor: "#f44336",
  },
  buttonSubmit: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddUserForm;
