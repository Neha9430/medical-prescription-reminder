// controllers/forgotPasswordController.js
import User from "../models/User.js";
import { sendResetOTP } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

// 1️⃣ Send OTP
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  await sendResetOTP(email, otp);
  res.status(200).json({ message: "OTP sent to email" });
};

// 2️⃣ Verify OTP & Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ message: "Password reset successfully!" });
};
