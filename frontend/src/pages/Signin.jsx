import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "email":
        if (!emailRegex.test(value)) newErrors.email = "Invalid email address.";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password is required.";
        else delete newErrors.password;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";
    if (!password) newErrors.password = "Password is required.";
    setErrors(newErrors);

    const shake = {};
    Object.keys(newErrors).forEach((key) => {
      shake[key] = true;
      setTimeout(() => setShakeFields((prev) => ({ ...prev, [key]: false })), 300);
    });
    setShakeFields(shake);

    if (Object.keys(newErrors).length === 0) {
      alert("Signin successful!");
    }
  };

  const handleChange = (name, value) => {
    switch (name) {
      case "email": setEmail(value); break;
      case "password": setPassword(value); break;
      default: break;
    }
    validateField(name, value);
  };

  const inputWrapper = "flex items-center border rounded bg-gray-300 border-gray-400 w-full h-12 px-3";
  const inputStyle = "flex-1 bg-gray-300 focus:outline-none";

  return (
    <div className="w-full max-w-md p-5 bg-gray-300 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        {/* Email */}
        <div className={`relative ${errors.email && shakeFields.email ? "animate-shake" : ""}`}>
          <div className={inputWrapper}>
            <Mail className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type="email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@gmail.com"
              className={`${inputStyle} ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className={`relative ${errors.password && shakeFields.password ? "animate-shake" : ""}`}>
          <div className={`${inputWrapper} pr-10`}>
            <Lock className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Password"
              className={`${inputStyle} ${errors.password ? "border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="bg-teal-500 text-white py-2 rounded hover:bg-teal-800"
        >
          Sign In
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        Don't have an account? <Link to="/signup" className="text-sky-500">Sign Up</Link>
      </p>

      {/* Tailwind shake animation */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.3s ease;
          }
        `}
      </style>
    </div>
  );
}
