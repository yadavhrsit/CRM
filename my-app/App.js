import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";
import { AddLeadContext, AddLeadProvider } from "./context/AddLeadContext";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LIGHT_THEME } from "./constants/themeConstants";
import icons from "./constants/icons";
import Icon from "react-native-vector-icons/Ionicons";
import Login from "./screens/Login";
import AdminDashboard from "./screens/AdminDashboard";
import EmployeeDashboard from "./screens/EmployeeDashboard";
import Leads from "./screens/Leads";
import FollowUps from "./screens/FollowUps";
import Settings from "./screens/Settings";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { addLead, toggleAddLead } = useContext(AddLeadContext);
  const { token, user } = useAuth();

  const renderHeaderThemeSwitcher = () => (
    <TouchableOpacity style={{ padding: 10 }} onPress={toggleTheme}>
      <Icon
        name={theme === LIGHT_THEME ? "sunny" : "moon"}
        size={24}
        color={theme === LIGHT_THEME ? "#FFA500" : "#FFF"}
      />
    </TouchableOpacity>
  );

  const TabIcon = ({ icon, focused }) => {
    return (
      <View className="">
        <Image
          source={icon}
          resizeMode="contain"
          className="h-6 my-4"
          tintColor={`${!focused && "gray"}`}
        />
      </View>
    );
  };

  const addLeadBtn = () => (
    <TouchableOpacity
      onPress={toggleAddLead}
      className="flex flex-row justify-center items-center bg-[#2763ad] px-4 rounded-md"
    >
      <Icon name={"add-circle-sharp"} size={24} color={"#FFF"} />
      <Text className="ml-1" style={{ color: "#FFF",fontWeight:600 }}>
        Add Lead
      </Text>
    </TouchableOpacity>
  );

  const renderHeadRight = () => (
    <View className="flex flex-row gap-2">
      {addLeadBtn()}
      {renderHeaderThemeSwitcher()}
    </View>
  );

  if (!token || !user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: "Login",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerRight: renderHeadRight,
          headerStyle: {
            backgroundColor: theme === LIGHT_THEME ? "#f5f5f5" : "#333",
          },
          headerTintColor: theme === LIGHT_THEME ? "#000" : "#fff",
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={user.role === "admin" ? AdminDashboard : EmployeeDashboard}
          options={{
            title: "Dashboard",
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.dashboard} focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Leads"
          component={Leads}
          options={{
            title: "Leads",
            tabBarLabel: "Leads",
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.leads} focused={focused} />
            ),
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
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: "Settings",
            tabBarLabel: "Settings",
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.settings} focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const RootApp = () => (
  <AuthProvider>
    <NotificationProvider>
      <ThemeProvider>
        <AddLeadProvider>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </AddLeadProvider>
      </ThemeProvider>
    </NotificationProvider>
  </AuthProvider>
);

export default RootApp;
