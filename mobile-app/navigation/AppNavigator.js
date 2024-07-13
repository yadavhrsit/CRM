import { useState,useContext } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AddLeadContext } from "../context/AddLeadContext";
import { AddUserContext } from "../context/AddUserContext";
import { useAuth } from "../context/AuthContext";
import { useColorScheme } from "nativewind";
import icons from "../constants/icons";
import AddLeadForm from "../components/AddLeadForm";
import AdminDashboard from "../screens/AdminDashboard";
import EmployeeDashboard from "../screens/EmployeeDashboard";
import FollowUps from "../screens/FollowUps";
import Settings from "../screens/Settings";
import LeadStack from "../navigation/LeadStack";
import UserStack from "../navigation/UserStack";
import {
  HeaderThemeSwitcher,
  AddUserButton,
  AddLeadButton,
  LogoutButton,
} from "../components/HeaderButtons";
import TabIcon from "../components/TabIcon";
import { StatusBar } from "expo-status-bar";
const Tab = createBottomTabNavigator();

function AppNavigator() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { addLead, toggleAddLead } = useContext(AddLeadContext);
  const { addUser, toggleAddUser } = useContext(AddUserContext);
  const { token, user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
    }, 1500);
  };

  const renderHeadRight = () => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {user && user.role === "employee" && (
        <AddLeadButton toggleAddLead={toggleAddLead} />
      )}
      <HeaderThemeSwitcher toggleColorScheme={toggleColorScheme} />
    </View>
  );

  const adminHeaderRight = () => (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <AddUserButton toggleAddUser={toggleAddUser} />
      <HeaderThemeSwitcher toggleColorScheme={toggleColorScheme} />
    </View>
  );

  return (
    <>
      {addLead && <AddLeadForm />}
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerRight: renderHeadRight,
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#333" : "#f5f5f5",
            },
            headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
            headerTitleAlign: "left",
            tabBarLabelStyle: { fontSize: 14, marginVertical: 4 },
            tabBarStyle: { paddingVertical: 10, minHeight: 60 },
            tabBarActiveTintColor: "#2763ad",
          }}
        >
          <Tab.Screen
            name="Dashboard"
            component={
              user.role === "admin" ? AdminDashboard : EmployeeDashboard
            }
            options={{
              title: "Dashboard",
              tabBarLabel: "Dashboard",
              tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.dashboard} focused={focused} />
              ),
              unmountOnBlur: true,
            }}
            initialParams={{ addLead }}
          />
          <Tab.Screen
            name="Leads"
            component={LeadStack}
            options={{
              title: "Leads",
              tabBarLabel: "Leads",
              tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.leads} focused={focused} />
              ),
              headerShown: true,
              headerRight: renderHeadRight,
              unmountOnBlur: true,
            }}
          />
          <Tab.Screen
            name="Follow-Ups"
            component={FollowUps}
            options={{
              title: "Follow-Ups",
              tabBarLabel: "Follow-Ups",
              tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.followups} focused={focused} />
              ),
              unmountOnBlur: true,
            }}
          />
          {user && user.role === "admin" && (
            <Tab.Screen
              name="Users"
              component={UserStack}
              options={{
                title: "Users",
                tabBarLabel: "Users",
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon={icons.users} focused={focused} />
                ),
                unmountOnBlur: true,
                headerShown: true,
                headerRight: adminHeaderRight,
              }}
              initialParams={{ addUser }}
            />
          )}
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              title: "Settings",
              tabBarLabel: "Settings",
              tabBarIcon: ({ focused }) => (
                <TabIcon icon={icons.settings} focused={focused} />
              ),
              headerRight: () => (
                <LogoutButton
                  handleLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              ),
              unmountOnBlur: true,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}
export default AppNavigator;
