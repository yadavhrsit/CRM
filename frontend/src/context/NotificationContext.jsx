import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
