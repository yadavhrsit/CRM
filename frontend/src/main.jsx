import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
