import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useColorScheme } from "nativewind";

export const HeaderThemeSwitcher = ({ toggleColorScheme }) => {
  const { colorScheme } = useColorScheme();
  return (
    <TouchableOpacity style={{ padding: 10 }} onPress={toggleColorScheme}>
      <Icon
        name={colorScheme === "dark" ? "moon" : "sunny"}
        size={24}
        color={colorScheme === "dark" ? "#fff" : "#FFA500"}
      />
    </TouchableOpacity>
  );
};

export const AddUserButton = ({ toggleAddUser }) => (
  <TouchableOpacity
    onPress={toggleAddUser}
    style={{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#2763ad",
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 4,
    }}
  >
    <Icon name={"add-circle-sharp"} size={24} color={"#FFF"} />
    <Text style={{ marginLeft: 8, color: "#FFF", fontWeight: "600" }}>
      Add User
    </Text>
  </TouchableOpacity>
);

export const AddLeadButton = ({ toggleAddLead }) => (
  <TouchableOpacity
    onPress={toggleAddLead}
    style={{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#2763ad",
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 4,
    }}
  >
    <Icon name={"add-circle-sharp"} size={24} color={"#FFF"} />
    <Text style={{ marginLeft: 8, color: "#FFF", fontWeight: "600" }}>
      Add Lead
    </Text>
  </TouchableOpacity>
);

export const LogoutButton = ({ handleLogout, isLoggingOut }) => (
  <TouchableOpacity
    onPress={handleLogout}
    style={{
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#C80036",
      paddingHorizontal: 16,
      marginHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 8,
      marginBottom: 8,
    }}
  >
    <Icon name={"log-out"} size={24} color={"#FFF"} />
    <Text style={{ color: "#FFF", fontWeight: "600" }}>
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Text>
    {isLoggingOut && (
      <ActivityIndicator size="small" color="#FFF" style={{ marginLeft: 8 }} />
    )}
  </TouchableOpacity>
);
