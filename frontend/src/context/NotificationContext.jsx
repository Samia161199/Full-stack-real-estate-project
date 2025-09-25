import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const NotificationContext = createContext();

// Context Provider Component
export const NotificationProvider = ({ children }) => {
  // Load notifications from localStorage
  const [notifications, setNotifications] = useState(() => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Function to add a notification
  const addNotification = (message) => {
    const newNotification = {
      message,
      timestamp: new Date().toISOString(), // Standard timestamp
    };
    setNotifications((prev) => {
      const updatedNotifications = [newNotification, ...prev];
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications)); // Save to localStorage
      return updatedNotifications;
    });
  };

  // Function to remove a notification
  const removeNotification = (index) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((_, i) => i !== index);
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications)); // Save to localStorage
      return updatedNotifications;
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => useContext(NotificationContext);
