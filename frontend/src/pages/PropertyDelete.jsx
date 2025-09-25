import React, { useState } from "react";
import axiosInstance from "../utility/axiosInstance";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Updated from useHistory
import { useNotifications } from "../context/NotificationContext"; // Import notification hook

const PropertyDelete = ({ propertyId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications(); // Use notification context

  // Handle property deletion
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/properties/${propertyId}`);

      // 🔔 Send a notification
      addNotification(`Property ID ${propertyId} was deleted successfully.`);

      alert("Property deleted successfully!");
      setLoading(false);
      onDeleteSuccess(); // Refresh property list
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to delete property.");
    }
  };

  // Toggle delete confirmation
  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {!showConfirm ? (
        <button
          onClick={toggleConfirm}
          className="text-red-500 hover:text-red-700 flex items-center"
        >
          <MdDelete className="mr-2" size={24} />
          Delete Property
        </button>
      ) : (
        <div className="flex flex-col">
          <p className="text-sm text-red-500 mb-2">
            Are you sure you want to delete this property?
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={toggleConfirm}
              className="bg-gray-300 p-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDelete;
