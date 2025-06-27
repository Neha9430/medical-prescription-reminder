import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

const ProfilePage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setPrescriptions(res.data.prescriptions || []);
        setReminders(res.data.reminders || []);
      }
    } catch (err) {
      console.error("History fetch error:", err.message);
    }
  };

  // ✅ DELETE Prescription
  const handleDeletePrescription = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/prescriptions/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(" Prescription deleted!");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to delete prescription");
    }
  };

  // ✅ DELETE Reminder
  const handleDeleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/reminders/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(" Reminder deleted!");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to delete reminder");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="heading">  My Profile</h1>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>

        <div className="section">
          <h2> Recent Prescriptions</h2>
          {Array.isArray(prescriptions) && prescriptions.length === 0 ? (
            <p>No prescriptions found.</p>
          ) : (
            prescriptions.map((pres) => (
              <div key={pres._id} className="card-item">
                <p>
                  <strong>Date:</strong> {pres.date}
                </p>
                <p>
                  <strong>Medicines:</strong>
                </p>
                <ul>
                  {Array.isArray(pres.medicines) &&
                    pres.medicines.map((med, idx) => (
                      <li key={idx}>
                        {med.name} - {med.dosage} - {med.timing}
                      </li>
                    ))}
                </ul>
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePrescription(pres._id)}
                >
                  Delete Prescription
                </button>
              </div>
            ))
          )}
        </div>

        <div className="section">
          <h2> Reminders</h2>
          {Array.isArray(reminders) && reminders.length === 0 ? (
            <p>No reminders found yet.</p>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder._id} className="history-card">
                <h3> {reminder.medicineName}</h3>
                <p>Date: {new Date(reminder.date).toLocaleDateString()}</p>
                <p>Time: {reminder.reminderTime}</p>
                <p>Status: {reminder.taken ? "Taken" : "Missed"}</p>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteReminder(reminder._id)}
                >
                   Delete Reminder
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
