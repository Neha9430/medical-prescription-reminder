import express from "express";
import { createReminder } from "../controllers/reminderController.js";
import { markReminderAsTaken } from "../controllers/reminderController.js";
import { getUpcomingReminders } from "../controllers/reminderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  updateReminder,
  deleteReminder,
  deletePrescription,
} from "../controllers/reminderController.js";

import { getUserPrescriptions } from "../controllers/reminderController.js";

const router = express.Router();

// POST /api/reminders/create
router.post("/create", createReminder);
router.put("/taken/:reminderId", markReminderAsTaken);
router.get("/upcoming/:userId", getUpcomingReminders);
router.get("/history", authMiddleware, getUserPrescriptions);
router.put("/update/:id", authMiddleware, updateReminder);
router.delete("/delete/:id", authMiddleware, deleteReminder);
router.delete("/delete/:id", deletePrescription);
router.put("/taken/:reminderId", markReminderAsTaken);


export default router;
