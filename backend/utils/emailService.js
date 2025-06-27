// utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// 🔁 .env variables load करने के लिए
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 🔐 Gmail App Password
  },
});

export const sendReminderEmail = async (to, medicine, time) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // 🔁 यह भी .env से लेना चाहिए
    to,
    subject: `💊 Reminder: Take your medicine - ${medicine}`,
    text: `Hi,\n\nIt's time to take your medicine: ${medicine} at ${time}.\n\nStay healthy!\n\n- Medical Reminder App`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
