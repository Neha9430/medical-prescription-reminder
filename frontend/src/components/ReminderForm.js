// src/components/ReminderForm.js
import React, { useState } from "react";
import axios from "axios";

const ReminderForm = () => {
  const [medicineName, setMedicineName] = useState("");
  const [times, setTimes] = useState([""]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleTimeChange = (idx, value) => {
    const copy = [...times];
    copy[idx] = value;
    setTimes(copy);
  };

  const addTimeField = () => setTimes([...times, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post("http://localhost:5000/api/reminders/create", {
        userId,
        medicineName,
        times,
        startDate,
        endDate,
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.error || "Reminder creation failed"));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Set Medicine Reminder</h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Medicine Name</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          required
        />

        <label className="block mb-1">Reminder Time(s)</label>
        {times.map((t, idx) => (
          <input
            key={idx}
            type="time"
            className="w-full border p-2 rounded mb-2"
            value={t}
            onChange={(e) => handleTimeChange(idx, e.target.value)}
            required
          />
        ))}
        <button
          type="button"
          onClick={addTimeField}
          className="text-blue-600 mb-4 text-sm"
        >
          + Add another time
        </button>

        <label className="block mb-1">Start Date</label>
        <input
          type="date"
          className="w-full border p-2 rounded mb-4"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label className="block mb-1">End Date</label>
        <input
          type="date"
          className="w-full border p-2 rounded mb-6"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Save Reminder
        </button>
      </form>
    </div>
  );
};

export default ReminderForm;
