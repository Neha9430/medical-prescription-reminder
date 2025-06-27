import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./UploadPrescription.css";

const UploadPrescription = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [reminderInputs, setReminderInputs] = useState([]);

  const userId = localStorage.getItem("userId");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/prescriptions/upload-prescription",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setParsedData(res.data.data);
      setSuccessMsg("Prescription uploaded  successfully!");

      // Create empty date/time for each medicine
      setReminderInputs(
        res.data.data.medicines.map(() => ({
          startDate: "",
          endDate: "",
          time: "",
        }))
      );
    } catch (error) {
      console.error(" Upload error:", error);
      alert(" Upload failed");
    }
  };

  const handleDateChange = (index, field, value) => {
    const updatedInputs = [...reminderInputs];
    updatedInputs[index][field] = value;
    setReminderInputs(updatedInputs);
  };

  const handleSaveReminder = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) return alert("User not found!");

  let savedAny = false;

  try {
    for (let i = 0; i < parsedData.medicines.length; i++) {
      const med = parsedData.medicines[i];
      const input = reminderInputs[i];

      const { startDate, endDate, time } = input;

      // 🔐 Check if all fields are set
      if (startDate && endDate && time) {
        await axios.post("http://localhost:5000/api/reminders/create", {
          userId,
          medicineName: med,
          times: [time],
          startDate,
          endDate,
          taken: false,
        });
        savedAny = true;
      }
    }

    if (savedAny) {
      alert("Selected medicine reminders saved successfully!");
      navigate("/upcoming-reminders");
    } else {
      alert(" No valid reminders to save. Please set date/time.");
    }
  } catch (err) {
    console.error(err);
    alert("Error saving reminders");
  }
};

  const getPurpose = async (medicineName) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/medicine-purpose",
        {
          medicineName,
        }
      );
      alert(` ${medicineName}: ${res.data.purpose}`);
    } catch (err) {
      console.error("Error fetching AI purpose:", err);
      alert("Failed to get purpose");
    }
  };

  return (
    <div className="upload-prescription-container">
      <div className="upload-card">
        <h2> Add Prescription</h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button className="upload-btn" onClick={handleUpload}>
          Upload Prescription
        </button>
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          Back to Dashboard
        </button>
        {successMsg && <p className="success-msg">{successMsg}</p>}

        {parsedData && (
          <div className="extracted-block">
            <h3>
              <u>Extracted Info:</u>
            </h3>
            <p>
              <b> Patient:</b> {parsedData.patientName}
            </p>
            <p>
              <b> Doctor:</b> {parsedData.doctorName}
            </p>
            <p>
              <b> Date:</b> {parsedData.date}
            </p>
            <p>
              <b> BP:</b> {parsedData.bp || "--"}
            </p>
            <p>
              <b>SpO2:</b> {parsedData.spo2 || "--"}
            </p>
            <p>
              <b>
                <u>Medicines:</u>
              </b>
            </p>
            {parsedData.medicines.map((med, index) => (
              <div className="medicine-group" key={index}>
                <b>{med}</b>
                <button
                  onClick={() => getPurpose(med)}
                  style={{ marginLeft: "10px" }}
                >
                  What is this?
                </button>

                <br />
                <input
                  type="date"
                  value={reminderInputs[index]?.startDate || ""}
                  onChange={(e) =>
                    handleDateChange(index, "startDate", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={reminderInputs[index]?.endDate || ""}
                  onChange={(e) =>
                    handleDateChange(index, "endDate", e.target.value)
                  }
                />

                <input
                  type="time"
                  value={reminderInputs[index]?.time || ""}
                  onChange={(e) =>
                    handleDateChange(index, "time", e.target.value)
                  }
                />
              </div>
            ))}

            <button className="save-btn" onClick={handleSaveReminder}>
              Save Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPrescription;
