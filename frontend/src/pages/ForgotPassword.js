import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import API_BASE_URL from "../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); 

  const handleSendOTP = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/users/forgot-password`, { email });

     
      localStorage.setItem("resetEmail", email);

      alert("OTP sent to your email");

      
      navigate("/reset-password");
    } catch (err) {
      alert(" Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
  <div className="forgot-container">
    <h2>Forgot Password</h2>
    <input
      type="email"
      placeholder="Enter email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <button onClick={handleSendOTP}>Send OTP</button>
  </div>
);

};

export default ForgotPassword;
