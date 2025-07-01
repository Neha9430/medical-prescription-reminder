// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import API_BASE_URL from "../config";

const Dashboard = () => {
  const name = localStorage.getItem("name") || "User";
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchReminders = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/reminders/upcoming/${userId}`
        );
        setReminders(res.data);
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-card">
          <center>
            <h2>Welcome {name} to your Dashboard</h2>
          </center>

          <div className="section-header">
            <h3>Upcoming Reminders (Next few)</h3>

            <div className="dashboard-buttons">
              <Link to="/upload-prescription" className="dashboard-btn">
                Add Prescription
              </Link>
              <Link to="/upcoming-reminders" className="dashboard-btn">
                View All
              </Link>
              <Link to="/profile" className="dashboard-btn">
                My Profile
              </Link>
              <Link to="/" onClick={handleLogout} className="dashboard-btn">
                Logout
              </Link>
            </div>
          </div>

          {reminders.length === 0 ? (
            <p className="no-reminder-msg">No upcoming reminders found.</p>
          ) : (
            <ul className="reminder-list">
              {reminders.slice(0, 3).map((reminder) => (
                <li key={reminder._id} className="reminder-item">
                  <span className="pill-icon"></span>
                  <strong>{reminder.medicineName}</strong>
                  <br />
                  {reminder.reminderTime} on{" "}
                  {new Date(reminder.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
