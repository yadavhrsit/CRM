import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AddLeadProvider } from "./context/AddLeadContext";
import { AddUserProvider } from "./context/AddUserContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import AuthNavigator from "./navigation/AuthNavigator";
import AppNavigator from "./navigation/AppNavigator";

const App = () => {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <AuthNavigator />;
  }

  return <AppNavigator />;
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
