import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfXQUbxQhB6bnvQcw8H7EEEKPHQDzhxO0", // 👈 Your key here
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  const center = { lat: 26.9124, lng: 75.7873 }; // Example: Jaipur

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={13}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
