import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./UpcomingReminders.css";

// 🔧 Fix timezone issue for input type="date"
const getLocalDate = (dateString) => {
  const date = new Date(dateString);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
};

const UpcomingReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [editReminderId, setEditReminderId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ⏳ Fetch Reminders
  const fetchReminders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/reminders/upcoming/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReminders(res.data || []);
    } catch (err) {
      console.error(" Reminder fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [userId, token]);

  // ✏️ Start Editing
  const startEdit = (reminder) => {
    setEditReminderId(reminder._id);
    setEditDate(getLocalDate(reminder.date)); // Fixed timezone issue here
    setEditTime(reminder.reminderTime);
  };

  // ✅ Mark Reminder as Taken
const markAsTaken = async (id) => {
  try {
    await axios.put(
      `http://localhost:5000/api/reminders/taken/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    alert("Marked as taken!");
    fetchReminders(); // refresh reminders
  } catch (err) {
    console.error("Failed to mark as taken", err);
    alert("Error marking reminder");
  }
};


  // ✅ Save Updated Reminder
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/reminders/update/${editReminderId}`,
        { date: editDate, reminderTime: editTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(" Reminder updated!");
      setEditReminderId(null);
      fetchReminders();
    } catch (err) {
      console.error(" Update failed", err);
      toast.error(" Failed to update");
    }
  };

  // 🗑️ Delete Reminder
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/reminders/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Reminder deleted!");
      fetchReminders();
    } catch (err) {
      console.error(" Delete failed", err);
      toast.error("Failed to delete reminder");
    }
  };

  return (
    <div className="upcoming-reminders-container">
      <h2> Upcoming Medicine Reminders</h2>

      {reminders.length === 0 ? (
        <p>No reminders found.</p>
      ) : (

        <div className="reminder-scroll-area">
        <div className="reminder-grid">
          {reminders.map((reminder) => (
            <div className="reminder-card" key={reminder._id}>
              <h3>{reminder.medicineName}</h3>

              {editReminderId === reminder._id ? (
                <>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                  />
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditReminderId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(reminder.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {reminder.reminderTime}
                  </p>
                  {!reminder.taken && (
  <button onClick={() => markAsTaken(reminder._id)}>Mark as Taken</button>
)}

                  <p>
  <strong>Status:</strong>{" "}
  {reminder.taken
    ? " Taken"
    : new Date(reminder.date) < new Date()
    ? " Missed"
    : "Upcoming"}
</p>

                  <button onClick={() => startEdit(reminder)}> Edit</button>
                </>
              )}

              <button onClick={() => handleDelete(reminder._id)}> Delete</button>
            </div>
          ))}
        </div>
        </div>
      )}

      <button
        onClick={() => navigate("/upload-prescription")}
        className="back-btn"
      >
         Back to Upload Prescription
      </button>
      <button onClick={() => navigate("/dashboard")} className="back-btn">
         Back to Dashboard
      </button>
    </div>
  );
};

export default UpcomingReminders;
