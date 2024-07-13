import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdminDashboard from "../screens/AdminDashboard";
import EmployeeDashboard from "../screens/EmployeeDashboard";
import { useAuth, AuthProvider } from "../context/AuthContext";
const Tab = createBottomTabNavigator();

function MyTabs() {
  const { token, user } = useAuth();
  return (
    <Tab.Navigator>
      {token && user ? (
        <Tab.Screen
          name="Dashboard"
          component={user.role === "admin" ? AdminDashboard : EmployeeDashboard}
        />
      ) : (
        <Tab.Screen name="Loading" component={LoadingScreen} />
      )}
    </Tab.Navigator>
  );
}
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Loading...</Text>
  </View>
);
export default MyTabs;
