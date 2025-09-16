import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import News from "./pages/News";
import CityMap from "./components/CityMap";

function App() {
  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/map" element={<CityMap />} />
      </Routes>
    </div>
  );
}

export default App;
