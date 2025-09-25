import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import axiosInstance from "../utility/axiosInstance";
import { useNotifications } from "../context/NotificationContext"; // For context

const Notification = () => {
  const navigate = useNavigate();
  const { removeNotification } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/notifications"); // Fetch notifications from the backend
        if (response.data?.notifications) {
          setNotifications(response.data.notifications);
        } else {
          setError("No notifications found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, []);

  // @ts-ignore
  const handleDeleteNotification = async (index) => {
    const notificationId = notifications[index]?.id; // Assuming notification has an 'id'
    if (notificationId) {
      try {
        // Make the API call to delete the notification from the backend
        const response = await axiosInstance.delete(`/notifications/${notificationId}`);
        
        // Check if the response indicates a successful deletion
        if (response.status === 200) {
          // Update the local state to remove the notification from UI
          setNotifications((prevNotifications) => prevNotifications.filter((_, i) => i !== index));
  
          // Remove the notification from context (if you're using context to manage notifications globally)
          removeNotification(index);
        }
      } catch (err) {
        // Handle any errors (backend failure, unauthorized, etc.)
        setError(err.response?.data?.message || "Failed to delete notification.");
      }
    }
  };
  

  return (
    <div
      className="fixed top-16 right-4 bg-white shadow-lg rounded-lg p-4 cursor-pointer w-80"
      onClick={() => navigate("/notifications")}
    >
      <h2 className="text-lg font-bold">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.slice(0, 3).map((notification, index) => (
          <div key={notification.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <p className="text-sm">{notification.message}</p>
              <span className="text-xs text-gray-500">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(notification.timestamp))}
              </span>
            </div>
            <MdCancel
              className="text-gray-400 hover:text-red-500 cursor-pointer"
              size={18}
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking delete
                handleDeleteNotification(index);
              }}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No new notifications</p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Notification;
