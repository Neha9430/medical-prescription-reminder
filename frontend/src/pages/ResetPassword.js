import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css"; // optional

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const handleReset = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/reset-password", {
        email,
        otp,
        newPassword,
      });

      alert(res.data.message || " Password reset successful!");
        navigate("/"); 
    } catch (err) {
      alert(" " + (err.response?.data?.message || "Reset failed"));
      console.error("Reset Error:", err);
    }
  };

 return (
  <div className="reset-container">
    <h2> Reset Password</h2>
    <input
      type="email"
      placeholder="Enter email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <input
      type="password"
      placeholder="Enter new password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <button onClick={handleReset}> Reset Password</button>
  </div>
);
}

export default ResetPassword;
