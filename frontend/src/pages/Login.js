import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import GoogleLoginButton from "./GoogleLoginButton"; // ✅ Google Button component

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const token = res.data.token;
      const name = res.data.name;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome!</h1>

        <div className="form-step">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <center>
            <button className="primary-btn" onClick={handleLogin}>
              Login
            </button>
          </center>

          {/* Google Login Button */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <GoogleLoginButton />
          </div>

          <div className="link-row">
            <button
              className="link-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password? |
            </button>
            <button className="link-btn" onClick={() => navigate("/register")}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
