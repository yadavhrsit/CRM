import React, { useState, useEffect } from "react";
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
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import axios from "axios";
import { BASE_URL } from "../constants/api";
import { useAuth } from "../context/AuthContext";

const AddFollowUpForm = ({
  leadId,
  showAddFollowUpModal,
  setShowAddFollowUpModal,
}) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [date, setDate] = useState();
  const [formData, setFormData] = useState({
    followDate: "",
    remarks: "",
    assignedTo: "",
    status: "open",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/users`, {
        headers: { Authorization: `${token}` },
      })
      .then((res) => {
        setUsers(res.data.users);
      });
  }, [token]);

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

  const submitFormData = () => {
    axios
      .post(`${BASE_URL}/follow-ups/${leadId}`, formData, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(() => {
        Alert.alert("Follow-Up Added", "Follow-Up has been added successfully");
        setFormData({
          followDate: "",
          remarks: "",
          assignedTo: "",
          status: "open",
        });
        setShowAddFollowUpModal(false);
      })
      .catch((err) => {
        Alert.alert("Failed to Add Follow-Up", err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFormSubmit = () => {
    let errors = {};
    setLoading(true);
    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = `Required`;
      }
    }

    if (formData.status === "closed") {
      Alert.alert(
        "Select Lead Status",
        "Lead Status is Closed. Please select Lead Status",
        [
          {
            text: "Cancel",
            onPress: () => setLoading(false),
            style: "cancel",
          },
          {
            text: "Won",
            onPress: () => {
              formData.leadStatus = "won";
              submitFormData();
            },
          },
          {
            text: "Lost",
            onPress: () => {
              formData.leadStatus = "lost";
              submitFormData();
            },
          },
        ]
      );
    } else {
      setFormErrors(errors);
      if (Object.keys(errors).length === 0) {
        submitFormData();
      } else {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddFollowUpModal(false);
    setFormData({
      followDate: "",
      remarks: "",
      assignedTo: "",
      status: "open",
    });
    setFormErrors({});
  };

  const handleDateChange = (value) => {
    setFormData({
      ...formData,
      followDate: value.date,
    });
    setShowDatePicker(false);
    if (formErrors.followDate) {
      setFormErrors({
        ...formErrors,
        followDate: "",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddFollowUpModal}
        
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Follow-Up</Text>
            <TouchableOpacity
              style={[styles.input, formErrors.followDate && styles.errorInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.followDate
                  ? dayjs(formData.followDate).format("DD-MM-YYYY")
                  : "Select Date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <Modal transparent={false} presentationStyle={"pageSheet"}>
                <SafeAreaView>
                  <View style={styles.datePickerContainer}>
                    <DateTimePicker
                      style={styles.datePicker}
                      mode="single"
                      date={date}
                      onChange={(params) => {
                        setDate(params.date);
                        handleDateChange(params);
                      }}
                    />
                  </View>
                </SafeAreaView>
              </Modal>
            )}
            {formErrors.followDate && (
              <Text style={styles.errorText}>{formErrors.followDate}</Text>
            )}
            <TextInput
              style={[styles.input, formErrors.remarks && styles.errorInput]}
              placeholder="Remarks"
              placeholderTextColor={"gray"}
              value={formData.remarks}
              onChangeText={(value) => handleChange("remarks", value)}
            />
            {formErrors.remarks && (
              <Text style={styles.errorText}>{formErrors.remarks}</Text>
            )}
            <View
              style={[
                styles.pickerContainer,
                formErrors.assignedTo && styles.errorInput,
              ]}
            >
              <TouchableOpacity onPress={() => setShowUserPicker(true)}>
                <Text style={styles.pickerText}>
                  {formData.assignedTo
                    ? users.find((user) => user._id === formData.assignedTo)
                        ?.name || "Select User"
                    : "Select User"}
                </Text>
              </TouchableOpacity>
              {showUserPicker && (
                <Modal transparent={true} visible={showUserPicker}>
                  <View style={styles.pickerModalContainer}>
                    <View style={styles.pickerModal}>
                      <Picker
                        selectedValue={formData.assignedTo}
                        onValueChange={(value) => {
                          handleChange("assignedTo", value);
                        }}
                        style={styles.picker}
                      >
                        <Picker.Item label="Select User" value="" />
                        {users.map((user) => (
                          <Picker.Item
                            key={user._id}
                            label={user.name}
                            value={user._id}
                          />
                        ))}
                      </Picker>
                      <Pressable
                        style={styles.pickerDoneButton}
                        onPress={() => setShowUserPicker(false)}
                      >
                        <Text style={styles.pickerDoneButtonText}>Done</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              )}
              {formErrors.assignedTo && (
                <Text style={[styles.errorText, { textAlign: "center" }]}>
                  {formErrors.assignedTo}
                </Text>
              )}
            </View>
            <View style={styles.pickerContainer}>
              <TouchableOpacity onPress={() => setShowStatusPicker(true)}>
                <Text style={styles.pickerText}>
                  {formData.status === "open" ? "Open" : "Closed"}
                </Text>
              </TouchableOpacity>
              {showStatusPicker && (
                <Modal transparent={true} visible={showStatusPicker}>
                  <View style={styles.pickerModalContainer}>
                    <View style={styles.pickerModal}>
                      <Picker
                        selectedValue={formData.status}
                        onValueChange={(value) => {
                          handleChange("status", value);
                        }}
                        style={styles.picker}
                      >
                        <Picker.Item label="Open" value="open" />
                        <Picker.Item label="Closed" value="closed" />
                      </Picker>
                      <Pressable
                        style={styles.pickerDoneButton}
                        onPress={() => setShowStatusPicker(false)}
                      >
                        <Text style={styles.pickerDoneButtonText}>Done</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              )}
              {formErrors.status && (
                <Text style={styles.errorText}>{formErrors.status}</Text>
              )}
            </View>
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
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    "Add Follow-Up"
                  )}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    justifyContent: "center",
  },
  errorInput: {
    borderColor: "red",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerText: {
    padding: 15,
    color: "#000",
  },
  picker: {
    width: "100%",
  },
  pickerModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerModal: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  pickerDoneButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  pickerDoneButtonText: {
    color: "white",
    fontWeight: "bold",
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
  hiddenDatePicker: {
    display: "none",
  },
  datePickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  datePicker: {
    width: "100%",
    marginBottom: 20,
  },
  datePickerDoneButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  datePickerDoneButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddFollowUpForm;
