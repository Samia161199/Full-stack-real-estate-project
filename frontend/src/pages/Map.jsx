// src/components/SimpleMap.js
import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const SimpleMap = () => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",  // Ensure the map has height
  };
  const center = { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
      >
        {/* Additional features or components can be added here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default SimpleMap;
