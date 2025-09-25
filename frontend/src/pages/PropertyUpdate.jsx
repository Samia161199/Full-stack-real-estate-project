import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utility/axiosInstance";
import { MdCancel } from "react-icons/md";

const PropertyUpdate = () => {
  const [property, setProperty] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    listing: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get(`/properties/${id}`);
        setProperty(response.data);
        setUpdateFormData(response.data); // Pre-fill the form with current property details
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch property data.");
      }
    };

    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(
        `/properties/${id}`,
        updateFormData
      );
      alert("Property updated successfully!");
      navigate("/dashboard"); // Redirect to dashboard after update
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update property.");
    }
  };

  const handleCancelEdit = () => {
    navigate("/dashboard"); // Navigate back to the dashboard if cancel is clicked
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      {error && <p className="text-red-500">{error}</p>}

      {property ? (
        <form onSubmit={handleUpdateProperty} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-semibold">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={updateFormData.title}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              value={updateFormData.description}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-semibold">Price</label>
            <input
              type="text"
              id="price"
              name="price"
              value={updateFormData.price}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="location" className="block font-semibold">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={updateFormData.location}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="category" className="block font-semibold">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={updateFormData.category}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="listing" className="block font-semibold">Listing</label>
            <input
              type="text"
              id="listing"
              name="listing"
              value={updateFormData.listing}
              onChange={handleInputChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Update Property
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 p-2 rounded-lg"
            >
              <MdCancel className="inline mr-2" />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p>Loading property data...</p>
      )}
    </div>
  );
};

export default PropertyUpdate;
