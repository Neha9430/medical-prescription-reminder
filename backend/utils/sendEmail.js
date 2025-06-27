// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetOTP = async (to, otp) => {
  const mailOptions = {
    from: `"Medical Reminder App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🛡️ Password Reset OTP",
    text: `Your OTP for resetting password is: ${otp}\nIt is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  console.log("📨 OTP sent to:", to);
};
