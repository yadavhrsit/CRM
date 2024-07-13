import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Users from "../screens/Users";
import UserView from "../screens/UserView";

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="All Users"
        component={Users}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="User Details"
        component={UserView}
        options={{ headerBackTitle: "Back" }}
      />
    </Stack.Navigator>
  );
};

export default UserStack;
