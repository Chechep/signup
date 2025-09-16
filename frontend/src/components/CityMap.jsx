// src/components/CityMap.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Utility to update map view
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 10, { animate: true });
  return null;
}

export default function CityMap({ city, setCity }) {
  const [position, setPosition] = useState([1.2921, 36.8219]); // Default: Nairobi

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("City not found!");
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Map */}
      <MapContainer center={position} zoom={6} className="w-full h-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ChangeView center={position} />
        <Marker position={position}>
          <Popup>{city || "Selected City"}</Popup>
        </Marker>
      </MapContainer>

      {/* Search Overlay */}
      <form
        onSubmit={handleSearch}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white p-2 rounded-lg shadow-md flex"
      >
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          className="px-3 py-2 border rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>
    </div>
  );
}
