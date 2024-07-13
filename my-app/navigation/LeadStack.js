import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Leads from "../screens/Leads";
import LeadView from "../screens/LeadView";

const Stack = createNativeStackNavigator();

const LeadStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="All Leads"
        component={Leads}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Lead Details"
        component={LeadView}
        options={{ headerBackTitle: "Go Back" }}
      />
    </Stack.Navigator>
  );
};

export default LeadStack;
