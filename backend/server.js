// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import ocrRoutes from "./routes/ocrRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import startReminderScheduler from "./utils/reminderScheduler.js";
import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup for React frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Middlewares
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/ai", aiRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("Medical Prescription Reminder backend running");
});

// DB connection
// mongoose.connect("mongodb://localhost:27017/medical-reminder")
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
  


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderScheduler(); // 🕐 Reminders scheduler
});


//http://localhost:5000/api/prescriptions/save
//http://localhost:5000/api/users/register
//http://localhost:5000/api/users/login
//http://localhost:5000/api/reminders/create
//http://localhost:5000/api/prescriptions/upload-prescription