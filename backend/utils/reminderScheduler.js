import Reminder from "../models/Reminder.js";
import moment from "moment";
import User from "../models/User.js";
import { sendReminderEmail } from "./emailService.js";

const startReminderScheduler = () => {
  setInterval(async () => {
    const now = moment();
    const currentTime = now.format("HH:mm");
    const today = moment().startOf("day");

    console.log("🕒 Checking reminders at:", currentTime); // ✅ Log time check

    try {
      const reminders = await Reminder.find({
        reminderTime: currentTime,
        date: {
          $gte: today.toDate(),
          $lt: moment(today).endOf("day").toDate()
        },
        taken: false
      });

      console.log(`📋 Found ${reminders.length} reminders at ${currentTime}`);

      for (const reminder of reminders) {
        const user = await User.findById(reminder.userId);
        if (user?.email) {
          console.log(`📧 Sending email to ${user.email} for medicine: ${reminder.medicineName} at ${reminder.reminderTime}`);
          await sendReminderEmail(user.email, reminder.medicineName, reminder.reminderTime);
        } else {
          console.log(`❌ No email found for userId: ${reminder.userId}`);
        }
      }

      console.log(`✅ Emails sent for ${reminders.length} reminders`);
    } catch (err) {
      console.error("❌ Error in email scheduler:", err.message);
    }
  }, 60000); // Every 1 minute
};

export default startReminderScheduler;
