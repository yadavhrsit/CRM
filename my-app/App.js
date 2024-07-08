import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddLeadContext, AddLeadProvider } from "./context/AddLeadContext";
import { AddUserContext, AddUserProvider } from "./context/AddUserContext";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import icons from "./constants/icons";
import Icon from "react-native-vector-icons/Ionicons";
import Login from "./screens/Login";
import AdminDashboard from "./screens/AdminDashboard";
import EmployeeDashboard from "./screens/EmployeeDashboard";
import Leads from "./screens/Leads";
import FollowUps from "./screens/FollowUps";
import Settings from "./screens/Settings";
import LeadView from "./screens/LeadView";
import Users from "./screens/Users";
import UserView from "./screens/UserView";
import AddLeadForm from "./components/AddLeadForm";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { addLead, toggleAddLead } = useContext(AddLeadContext);
  const { addUser, toggleAddUser } = useContext(AddUserContext);
  const { token, user, logout } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const renderHeaderThemeSwitcher = () => (
    <TouchableOpacity style={{ padding: 10 }} onPress={toggleColorScheme}>
      <Icon
        name={colorScheme === "dark" ? "moon" : "sunny"}
        size={24}
        color={colorScheme === "dark" ? "#fff" : "#FFA500"}
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
  const addUserBtn = () => (
    <TouchableOpacity
      onPress={toggleAddUser}
      className="flex flex-row justify-center items-center bg-[#2763ad] px-4 rounded-md mb-1"
    >
      <Icon name={"add-circle-sharp"} size={24} color={"#FFF"} />
      <Text className="ml-1" style={{ color: "#FFF", fontWeight: 600 }}>
        Add User
      </Text>
    </TouchableOpacity>
  );
  const addLeadBtn = () => (
    <TouchableOpacity
      onPress={toggleAddLead}
      className="flex flex-row justify-center items-center bg-[#2763ad] px-4 rounded-md mb-1"
    >
      <Icon name={"add-circle-sharp"} size={24} color={"#FFF"} />
      <Text className="ml-1" style={{ color: "#FFF", fontWeight: 600 }}>
        Add Lead
      </Text>
    </TouchableOpacity>
  );
  const logoutButton = () => (
    <TouchableOpacity
      onPress={handleLogout}
      className="flex flex-row justify-center items-center bg-[#C80036] px-4 py-2 mr-2 rounded-md mb-2"
    >
      <Icon name={"log-out"} size={24} color={"#FFF"} />
      <Text className="ml-1" style={{ color: "#FFF", fontWeight: 600 }}>
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Text>
      {isLoggingOut && (
        <ActivityIndicator
          size="small"
          color="#FFF"
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
    }, 2000);
  };
  const renderHeadRight = () => (
    <View className="flex flex-row gap-2">
      {user && user.role === "employee" && addLeadBtn()}
      {renderHeaderThemeSwitcher()}
    </View>
  );
  const adminHeaderRight = () => (
    <View className="flex flex-row gap-2">
      {addUserBtn()}
      {renderHeaderThemeSwitcher()}
    </View>
  );

  function LeadScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="All Leads"
          component={Leads}
          options={{
            title: "All Leads",
            headerTitle: () => (
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text className="font-semibold text-lg">All Leads</Text>
              </View>
            ),
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Lead Details"
          component={LeadView}
          options={{
            headerBackTitle: "Go Back",
          }}
        />
      </Stack.Navigator>
    );
  }

  function UsersScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="All Users"
          component={Users}
          options={{
            title: "Users",
            headerTitle: () => (
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text className="font-semibold text-lg">All Users</Text>
              </View>
            ),
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="User Details"
          component={UserView}
          options={{
            headerBackTitle: "Back",
          }}
        />
      </Stack.Navigator>
    );
  }

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
            headerTransparent: false,
            headerTitleAlign: "left",
            tabBarLabelStyle:{
              fontSize:14,
              marginVertical:4
            },
            tabBarStyle:{
              paddingVertical:10,
              minHeight:60
            },
            
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
            component={LeadScreen}
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
              component={UsersScreen}
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
              headerRight: logoutButton,
              unmountOnBlur: true,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>

      <StatusBar style={`${colorScheme === "dark" ? "light" : "dark"}`} />
    </>
  );
};

const RootApp = () => (
  <AuthProvider>
    <NotificationProvider>
      <AddLeadProvider>
        <AddUserProvider>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </AddUserProvider>
      </AddLeadProvider>
    </NotificationProvider>
  </AuthProvider>
);

export default RootApp;
