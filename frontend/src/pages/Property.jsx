import React, { useState } from "react";
import axios from "axios";
import { useNotifications } from "../context/NotificationContext"; // Import notifications

const PropertiesUpdate = () => {
  const [formData, setFormData] = useState({
    propertyTitle: "",
    description: "",
    category: "Apartments",
    listedIn: "All Listing",
    price: "",
    taxRate: "",
    location: "",
    images: [],
  });

  const [message, setMessage] = useState("");
  const { addNotification } = useNotifications(); // Hook for notifications

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.propertyTitle);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("listedIn", formData.listedIn);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("location", formData.location);

    // Append images
    for (let i = 0; i < formData.images.length; i++) {
      formDataToSend.append("images", formData.images[i]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/properties",
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Property uploaded successfully!");

      // ✅ Add a notification
      addNotification(`Property "${formData.propertyTitle}" was uploaded successfully!`);

      console.log(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      setMessage(errorMessage);

      // ❌ Add an error notification
      addNotification(`Failed to update property: ${errorMessage}`);
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-indigo-800">Update Property</h1>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl">
        {/* Property Title */}
        <div>
          <label htmlFor="propertyTitle" className="block text-lg font-medium text-gray-800 mb-2">
            Property Title*
          </label>
          <input
            type="text"
            id="propertyTitle"
            placeholder="Enter property name"
            value={formData.propertyTitle}
            onChange={handleChange}
            className="mt-1 block w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-800 mb-2">
            Description*
          </label>
          <textarea
            id="description"
            rows="4"
            placeholder="Write a detailed description..."
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        {/* Category & Listed In */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="category" className="block text-lg font-medium text-gray-800 mb-2">
              Category*
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Apartments">Apartments</option>
              <option value="Houses">Houses</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label htmlFor="listedIn" className="block text-lg font-medium text-gray-800 mb-2">
              Listed In*
            </label>
            <select
              id="listedIn"
              value={formData.listedIn}
              onChange={handleChange}
              className="mt-1 block w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All Listing">All Listing</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-lg font-medium text-gray-800 mb-2">
            Price*
          </label>
          <input
            type="text"
            id="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-lg font-medium text-gray-800 mb-2">
            Location*
          </label>
          <input
            type="text"
            id="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="imageUpload" className="block text-lg font-medium text-gray-800 mb-2">
            Upload Images*
          </label>
          <input
            type="file"
            id="imageUpload"
            multiple
            accept=".png, .jpg, .jpeg"
            onChange={handleFileChange}
            className="mt-1 block w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-4 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Upload
          </button>
        </div>

        {/* Message Display */}
        {message && <p className="text-center text-lg text-red-600 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default PropertiesUpdate;
