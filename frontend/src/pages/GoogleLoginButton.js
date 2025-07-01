import React from "react";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from "../config";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const GoogleLoginButton = () => {
  const navigate = useNavigate(); 

  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Google User Info:", decoded);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/google-login`, {
        name: decoded.name,
        email: decoded.email,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      alert("Google login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error(" Google login failed:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default GoogleLoginButton; 
