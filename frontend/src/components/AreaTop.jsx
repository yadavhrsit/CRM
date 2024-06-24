// AreaTop.js
import { MdOutlineMenu } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { ThemeContext } from "../context/ThemeContext";
import AddLeadForm from "./AddLeadForm";
import Modal from "./Modal";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

const AreaTop = ({ title, showAddLeadBtn }) => {
  const navigate = useNavigate();
  const { openSidebar } = useContext(SidebarContext);
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();

  const { addNotification } = useNotification(); // Use addNotification from the NotificationContext

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const [clickedNotification, setClickedNotification] = useState(null);

  const isNotificationExpired = (timestamp) => {
    const now = new Date().getTime();
    return now - timestamp > 24 * 60 * 60 * 1000; // 24 hours
  };

  useEffect(() => {
    socket.on("notification", (notification) => {
      if (notification.user === user.username || notification.notifyEveryone) {
        const newNotification = {
          ...notification,
          timestamp: new Date().getTime(),
          read: false,
        };
        setNotifications((prevNotifications) => [
          newNotification,
          ...prevNotifications,
        ]);
        addNotification(newNotification); // Add new notification to the context
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [user, addNotification]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => !isNotificationExpired(notification.timestamp)
        )
      );
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (clickedNotification !== null) {
      const timeout = setTimeout(() => {
        navigate(`/leads/${clickedNotification}`);
      }, 100); // Slight delay to ensure state update is processed

      return () => clearTimeout(timeout);
    }
  }, [notifications, clickedNotification, navigate]);

  const handleNotificationsOpen = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications)
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
  };

  const handleNotificationClick = (index, id) => {
    setShowNotifications(false);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification, idx) => ({
        ...notification,
        read: index === idx ? true : notification.read,
      }))
    );
    setClickedNotification(id);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <section className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <button
            className="inline-flex items-center md:hidden dark:text-white"
            type="button"
            onClick={openSidebar}
          >
            <MdOutlineMenu size={24} />
          </button>
          <div className="flex gap-5 items-center justify-between">
            <h2
              className={`text-black ${
                theme === "dark" && "text-white"
              } text-lg xl:text-2xl font-semibold`}
            >
              {title}
            </h2>
            {showAddLeadBtn && (
              <button
                className={`px-4 py-2 rounded-md text-lg xl:text-xl font-semibold transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-offset-gray-800"
                    : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-offset-white"
                }`}
                onClick={() => setShowAddLeadModal(true)}
              >
                Add Lead
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            className="relative inline-flex items-center p-2 text-gray-700 dark:text-white"
            type="button"
            onClick={handleNotificationsOpen}
          >
            <MdNotifications size={24} />
            {notifications.filter((notification) => !notification.read).length >
              0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {
                  notifications.filter((notification) => !notification.read)
                    .length
                }
              </span>
            )}
          </button>
          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5`}
            >
              <div className="p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Notifications
                </h3>
                <button
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  onClick={clearNotifications}
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                      notification.read
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800 animate-flash"
                    }`}
                    onClick={() =>
                      handleNotificationClick(index, notification.id)
                    }
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {showAddLeadModal && (
        <Modal
          show={showAddLeadModal}
          onClose={() => setShowAddLeadModal(false)}
        >
          <AddLeadForm />
        </Modal>
      )}
    </>
  );
};

export default AreaTop;
