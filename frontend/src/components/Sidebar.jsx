import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/themeConstants";
import lightLogo from "../assets/images/logo_blue.svg";
import darkLogo from "../assets/images/logo_white.svg";
import {
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlineLogout,
  MdOutlineSettings,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { SidebarContext } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const { logout } = useAuth(); // Destructure logout function from useAuth hook

  const location = useLocation();
  const navigate = useNavigate();

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout(); // Call the logout function when the logout button is clicked
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img
            src={theme === LIGHT_THEME ? lightLogo : darkLogo}
            alt=""
            height={60}
            width={60}
          />
          <span className="sidebar-brand-text text-right">Hatch CRM</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/dashboard"
                className={`menu-link ${
                  location.pathname.includes("dashboard") && "active"
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/settings"
                className={`menu-link ${
                  location.pathname.includes("settings") && "active"
                }`}
              >
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </Link>
            </li>
            <li className="menu-item">
              <button className="menu-link" onClick={handleLogout}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
