// reminderRoutes.js
import express from "express";
import {
  createReminder,
  markReminderAsTaken,
  getUpcomingReminders,
  updateReminder,
  deleteReminder,
  getUserPrescriptions,
} from "../controllers/reminderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createReminder);
router.put("/taken/:reminderId", markReminderAsTaken);
router.get("/upcoming/:userId", getUpcomingReminders);
router.get("/history", authMiddleware, getUserPrescriptions);
router.put("/update/:id", authMiddleware, updateReminder);
router.delete("/delete/:id", authMiddleware, deleteReminder);

export default router;
