import React, { useState, useContext } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView,
  View,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";
import { AddLeadContext } from "../context/AddLeadContext";

const AddLeadForm = () => {
  const { token } = useAuth();
  const { addLead, toggleAddLead } = useContext(AddLeadContext);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    mobile: "",
    query: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    if (name === "company") {
      axios
        .get(`${BASE_URL}/companies`, {
          headers: {
            Authorization: `${token}`,
          },
          params: {
            search: value,
          },
        })
        .then((res) => {
          setCompanies(res.data.companies);
        });

      setFormData({ ...formData, company: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleCompanySelect = (name) => {
    setFormData({ ...formData, company: name });
    setCompanies([]); // Clear the suggestions
  };

  const handleFormSubmit = () => {
    let errors = {};
    setLoading(true);
    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = `${key} is required`;
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    axios
      .post(`${BASE_URL}/leads`, formData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(() => {
        Alert.alert("Lead Added", "Lead has been added successfully");
        setFormData({
          company: "",
          name: "",
          email: "",
          mobile: "",
          query: "",
        });
        toggleAddLead(false);
      })
      .catch((err) => {
        Alert.alert("Failed to Add Lead", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseModal = () => {
    toggleAddLead(false);
    // clearing form data and suggestion
    setFormData({
      company: "",
      name: "",
      email: "",
      mobile: "",
      query: "",
    });
    setCompanies([]);
    setFormErrors({});
  };

  return (
    <Modal animationType="slide" transparent={true} visible={addLead}>
      <SafeAreaView style={styles.container}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Lead</Text>
            <TextInput
              style={[styles.input, formErrors.company && styles.errorInput]}
              placeholder="Company"
              placeholderTextColor={"gray"}
              value={formData.company}
              onChangeText={(value) => handleChange("company", value)}
            />
            {formErrors.company && (
              <Text style={styles.errorText}>{formErrors.company}</Text>
            )}
            <FlatList
              data={companies}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleCompanySelect(item.name)}>
                  <Text style={styles.listItem}>{item.name}</Text>
                </Pressable>
              )}
              style={styles.dropdown}
            />

            <TextInput
              style={[styles.input, formErrors.name && styles.errorInput]}
              placeholder="Name"
              placeholderTextColor={"gray"}
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
            />
            {formErrors.name && (
              <Text style={styles.errorText}>{formErrors.name}</Text>
            )}
            <TextInput
              style={[styles.input, formErrors.email && styles.errorInput]}
              placeholder="Email"
              placeholderTextColor={"gray"}
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              keyboardType="email-address"
            />
            {formErrors.email && (
              <Text style={styles.errorText}>{formErrors.email}</Text>
            )}
            <TextInput
              style={[styles.input, formErrors.mobile && styles.errorInput]}
              placeholder="Mobile"
              placeholderTextColor={"gray"}
              value={formData.mobile}
              onChangeText={(value) => handleChange("mobile", value)}
              keyboardType="phone-pad"
            />
            {formErrors.mobile && (
              <Text style={styles.errorText}>{formErrors.mobile}</Text>
            )}
            <TextInput
              style={[styles.input, formErrors.query && styles.errorInput]}
              placeholder="Query"
              placeholderTextColor={"gray"}
              value={formData.query}
              onChangeText={(value) => handleChange("query", value)}
              multiline
            />
            {formErrors.query && (
              <Text style={styles.errorText}>{formErrors.query}</Text>
            )}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleCloseModal}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSubmit]}
                onPress={handleFormSubmit}
                disabled={loading}
              >
                <Text style={styles.textStyle}>
                  {loading ? <ActivityIndicator color="#fff" /> : "Add Lead"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

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
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  dropdown: {
    maxHeight: 100,
    width: "100%",
    marginBottom: 15,
  },
  listItem: {
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
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
export default AddLeadForm;
