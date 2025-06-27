// controllers/reminderController.js
import Reminder from "../models/Reminder.js";
import moment from "moment";

// ✅ Reminder creation function
export const createReminder = async (req, res) => {
  try {
    const { userId, medicineName, times, startDate, endDate } = req.body;

    console.log("🛬 Reminder API called:");
    console.log("📥 Received userId:", userId);
    console.log("📥 Received medicine:", medicineName);
    console.log("📥 Received times:", times);

    if (!userId || !medicineName || !times || !startDate || !endDate) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const start = moment(startDate);
    const end = moment(endDate);
    const today = moment().startOf("day");

    if (moment(startDate).isBefore(today)) {
      return res.status(400).json({
        message: "Start date cannot be in the past.",
      });
    }

    const remindersToSave = [];

    for (let m = moment(start); m.isSameOrBefore(end); m.add(1, "days")) {
      times.forEach((time) => {
        const reminder = {
          userId,
          medicineName,
          reminderTime: time,
          date: m.toDate(),
          taken: false, // ✅ Required field for validation
        };
        remindersToSave.push(reminder);
      });
    }

    console.log("📌 Reminders to insert:", remindersToSave);

    await Reminder.insertMany(remindersToSave);

    res.status(201).json({
      message: "Reminders created successfully",
      reminders: remindersToSave,
    });
  } catch (error) {
    console.error("❌ Reminder creation failed:", error.message);
    console.log("🛠 Reminder coming from userId:", userId);

    res.status(500).json({
      message: "Failed to create reminders",
      error: error.message,
    });
  }
};

// ✅ Reminder scheduler logic
export const checkReminders = async () => {
  const now = moment();
  const currentTime = now.format("HH:mm");
  const today = moment().startOf("day");

  try {
    const reminders = await Reminder.find({
      reminderTime: currentTime,
      date: {
        $gte: today.toDate(),
        $lt: moment(today).endOf("day").toDate(),
      },
      taken: false,
    });

    if (reminders.length > 0) {
      console.log(
        `🔔 Found ${reminders.length} reminder(s) at ${currentTime}:`
      );
      reminders.forEach((reminder) => {
        console.log(
          `📌 Reminder for ${reminder.medicineName} (User: ${reminder.userId})`
        );
      });
    } else {
      console.log(`⏱ No reminders at ${currentTime}`);
    }
  } catch (error) {
    console.error("Error checking reminders:", error.message);
  }
};
// ✅ GET all past reminders for a user
export const getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.user.userId; // middleware से decoded userId मिलेगा

    const history = await Reminder.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: "User prescription/reminder history fetched",
      data: history,
    });
  } catch (error) {
    console.error("❌ Failed to fetch user history:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/reminderController.js
export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    await Reminder.findByIdAndDelete(id);
    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
};

// controller/prescriptionController.js
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await Prescription.findByIdAndDelete(id);
    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete prescription", error: error.message });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, reminderTime } = req.body;

    const updated = await Reminder.findByIdAndUpdate(
      id,
      { date, reminderTime },
      { new: true }
    );

    res.status(200).json({ message: "Updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// controllers/reminderController.js

export const markReminderAsTaken = async (req, res) => {
  try {
    const { reminderId } = req.params;

    const updated = await Reminder.findByIdAndUpdate(
      reminderId,
      { taken: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({
      message: "Reminder marked as taken",
      reminder: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update reminder",
      error: error.message,
    });
  }
};
export const getUpcomingReminders = async (req, res) => {
  const { userId } = req.params;
  const today = moment().startOf("day").toDate();
  const now = moment().format("HH:mm");

  try {
    const reminders = await Reminder.find({
      userId,
      $or: [
        {
          date: today,
          reminderTime: { $gte: now },
        },
        {
          date: { $gt: today },
        },
      ],
      $or: [
        { taken: false },
        { taken: { $exists: false } }, // fallback if field missing
      ],
    }).sort({ date: 1, reminderTime: 1 });

    res.status(200).json(reminders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reminders", error: error.message });
  }
};
