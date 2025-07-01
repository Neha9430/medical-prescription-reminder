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

// ✅ FINAL CORS setup for frontend (localhost + Render)
const allowedOrigins = [
  "http://localhost:3000",
  "https://medical-reminder-frontend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// ✅ These middlewares should come AFTER cors()
app.use(bodyParser.json());
app.use(express.json());

// ✅ Handle preflight requests (CORS OPTIONS requests)
app.options("*", cors());

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

// MongoDB connection
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderScheduler(); // 🕐 Reminders scheduler
});
