import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInAnonymously } from "../firebase";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "fullName":
        if (!value.trim()) newErrors.fullName = "Full Name is required.";
        else delete newErrors.fullName;
        break;
      case "email":
        if (!emailRegex.test(value)) newErrors.email = "Invalid email address.";
        else delete newErrors.email;
        break;
      case "password":
        if (value.length < 6) newErrors.password = "Password must be at least 6 characters.";
        else delete newErrors.password;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleChange = (name, value) => {
    switch (name) {
      case "fullName": setFullName(value); break;
      case "email": setEmail(value); break;
      case "password": setPassword(value); break;
      default: break;
    }
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);

    const shake = {};
    Object.keys(newErrors).forEach((key) => {
      shake[key] = true;
      setTimeout(() => setShakeFields((prev) => ({ ...prev, [key]: false })), 300);
    });
    setShakeFields(shake);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Firebase email/password signup
        await createUserWithEmailAndPassword(auth, email, password);
        // Optionally, you can update user profile with fullName here
        navigate("/home");
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      }
    }
  };

  // Google Sign-Up
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  // Anonymous Sign-Up
  const handleAnonymousSignup = async () => {
    try {
      await signInAnonymously(auth);
      navigate("/home");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    }
  };

  const inputWrapper = "flex items-center border rounded bg-gray-300 border-gray-400 w-full h-12 px-3";
  const inputStyle = "flex-1 bg-gray-300 focus:outline-none";

  return (
    <div className="w-full max-w-md p-5 bg-gray-300 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        {/* Full Name */}
        <div className={`relative ${errors.fullName && shakeFields.fullName ? "animate-shake" : ""}`}>
          <div className={inputWrapper}>
            <User className="text-gray-500 w-5 h-5 mr-2" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Full Name"
              className={`${inputStyle} ${errors.fullName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
        </div>

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

        <button type="submit" className="bg-teal-500 text-white py-2 rounded hover:bg-teal-800">
          Sign Up
        </button>

        {/* Google Sign-Up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="bg-red-500 text-white py-2 rounded hover:bg-red-700"
        >
          Sign Up with Google
        </button>

        {/* Anonymous Sign-Up */}
        <button
          type="button"
          onClick={handleAnonymousSignup}
          className="bg-gray-500 text-white py-2 rounded hover:bg-gray-700"
        >
          Sign Up Anonymously
        </button>

      </form>

      <p className="mt-4 text-sm text-center">
        Already have an account? <Link to="/signin" className="text-sky-500">Sign In</Link>
      </p>

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
