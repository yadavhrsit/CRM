import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import PageNotFound from "./screens/PageNotFound";
import Login from "./screens/Login";
import AdminDashboard from "./screens/AdminDashboard";
import EmployeeDashboard from "./screens/EmployeeDashboard";
import Leads from "./screens/Leads";
import FollowUps from "./screens/FollowUps";
import Settings from "./screens/Settings";
import { useAuth } from "./context/AuthContext";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { token, user } = useAuth();

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<BaseLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard"
            element={
              token ? (
                user.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <EmployeeDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/leads" element={<Leads />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            alt="theme"
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button>
      </Router>
    </>
  );
}

export default App;
