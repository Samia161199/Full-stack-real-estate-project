import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axiosInstance from "../utility/axiosInstance";
import { MdDelete, MdEdit, MdCancel } from "react-icons/md";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import { useNotifications } from "../context/NotificationContext";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [geocodeLocation, setGeocodeLocation] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // New state variables for dropdowns
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedListing, setSelectedListing] = useState("");
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);

  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/users/profile");
        if (response.data?.user && response.data?.properties) {
          setUser(response.data.user);
          setProperties(response.data.properties);
          setUploadedCount(response.data.properties.length);

          // Extract unique categories and listings
          const uniqueCategories = [...new Set(response.data.properties.map(p => p.category))];
          const uniqueListings = [...new Set(response.data.properties.map(p => p.listing))];

          setCategories(uniqueCategories);
          setListings(uniqueListings);
        } else {
          setError("User or properties data not found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data.");
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedProperty?.location) {
      fetchCoordinates(selectedProperty.location);
    }
  }, [selectedProperty]);

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const location = response.data.results[0]?.geometry?.location;
      setGeocodeLocation(location || null);
    } catch (err) {
      setGeocodeLocation(null);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || property.category === selectedCategory) &&
      (selectedListing === "" || property.listing === selectedListing)
  );

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setEditFormData({ ...property });
    setIsEditing(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateProperty = async () => {
    try {
      const response = await axiosInstance.patch(
        `/properties/${selectedProperty.id}`,
        editFormData
      );
      setProperties((prev) =>
        prev.map((p) => (p.id === selectedProperty.id ? response.data : p))
      );
      setSelectedProperty(response.data);
      setIsEditing(false);
      addNotification(`Property "${selectedProperty.title}" updated successfully.`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update property.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;

    try {
      // Send DELETE request to the backend to delete the property
      await axiosInstance.delete(`http://localhost:3000/properties/${selectedProperty.id}`);

      // Update the local state to remove the deleted property
      setProperties((prev) =>
        prev.filter((property) => property.id !== selectedProperty.id)
      );

      // Update the uploaded property count
      setUploadedCount((prev) => prev - 1);

      // Store the title of the deleted property for the notification
      const deletedPropertyTitle = selectedProperty.title;

      // Reset the selected property and close the delete confirmation
      setSelectedProperty(null);
      setShowDeleteConfirm(false);

      // Send a notification about the deletion
      addNotification(`Property "${deletedPropertyTitle}" deleted.`);

    } catch (error) {
      // Error handling: Show error message if the deletion failed
      setError(error.response?.data?.message || "Failed to delete property.");
    }
  };

  const handleLocationClick = (location) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(location)}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <div className="p-6 flex">
      <div className="w-1/2 pr-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Search Bar */}
        <div className="mb-6 flex">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="   Search for properties..."
              className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-full shadow-md focus:ring-2 focus:ring-blue-400 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm === "" && (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            )}
          </div>
        </div>

        {/* Dropdown for Category and Listing side by side */}
        <div className="mb-4 flex space-x-4">
          {/* Category Dropdown */}
          <div className="w-1/2 sm:w-32">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-full py-1.5 px-3 w-full text-sm"
            >
              <option value="">Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Listing Dropdown */}
          <div className="w-1/2 sm:w-32">
            <select
              value={selectedListing}
              onChange={(e) => setSelectedListing(e.target.value)}
              className="border border-gray-300 rounded-full py-1.5 px-3 w-full text-sm"
            >
              <option value="">Listing</option>
              {listings.map((listing, index) => (
                <option key={index} value={listing}>
                  {listing}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="mb-4">
            <p>Welcome {user.username}!</p>
            <p>You have uploaded {uploadedCount} properties.</p>
            <p>_______________________________________</p>
          </div>
        )}

        {/* Property List */}
        <div>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property.id}
                className="border p-4 mb-4 rounded-lg shadow-md transition hover:scale-105 cursor-pointer"
                onClick={() => handlePropertyClick(property)}
              >
                <h2 className="font-semibold text-lg">{property.title}</h2>
                <p className="text-sm text-gray-600">{property.location}</p>
                <p className="text-lg font-bold text-green-600">{property.price}</p>
                <div className="flex justify-end space-x-4">
                  <MdEdit className="text-blue-500 cursor-pointer" size={24} />
                  <MdDelete
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-500 cursor-pointer"
                    size={24}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No properties found.</p>
          )}
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Property Details */}
      <div className="w-1/2 pl-6">
        {selectedProperty && (
          <div className="border p-6 rounded-lg shadow-lg bg-white">
            <div className="absolute top-2 right-2 flex space-x-4">
              {isEditing ? (
                <MdCancel onClick={handleCancelEdit} className="text-gray-600 cursor-pointer" size={24} />
              ) : (
                <MdEdit onClick={() => handlePropertyClick(selectedProperty)} className="text-blue-500 cursor-pointer" size={24} />
              )}
            </div>

            {/* Property Images */}
            <div className="mb-6">
              {selectedProperty.images?.length > 0 ? (
                <div className="overflow-x-scroll flex space-x-4 mb-4">
                  {selectedProperty.images.map((image, index) => (
                    <img key={index} src={`http://localhost:3000/uploads/${image}`} alt={selectedProperty.title} className="w-64 h-64 object-cover rounded-lg" />
                  ))}
                </div>
              ) : (
                <p>No images available.</p>
              )}

              <h2 className="text-2xl font-semibold mb-2">{selectedProperty.title}</h2>
              <p className="text-gray-600 mb-4">{selectedProperty.description}</p>

              {/* Clickable Location */}
              <p className="text-sm text-gray-500 mb-2">
                Location:{" "}
                <span
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => handleLocationClick(selectedProperty.location)}
                >
                  {selectedProperty.location}
                </span>
              </p>

              <p className="text-lg font-bold text-green-600 mb-4">Price: {selectedProperty.price}</p>

              {selectedProperty.category && (
                <p className="text-lg font-bold text-gray-500 mb-2">Category: {selectedProperty.category}</p>
              )}

              {selectedProperty.listing && (
                <p className="text-lg font-bold text-gray-500 mb-4">Listing: {selectedProperty.listing}</p>
              )}

              {geocodeLocation && (
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={geocodeLocation} zoom={14}>
                    <Marker position={geocodeLocation} />
                  </GoogleMap>
                </LoadScript>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
