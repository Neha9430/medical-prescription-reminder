import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Prescription from "../models/Prescription.js";
import jwt from "jsonwebtoken";
import Reminder from "../models/Reminder.js";

export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const prescriptions = await Prescription.find({ user: userId }).sort({
      createdAt: -1,
    });
    const reminders = await Reminder.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      prescriptions,
      reminders,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const googleLoginUser = async (req, res) => {
  const { email, name, googleId, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // new user, register them
      user = new User({
        name,
        email,
        password: googleId, // store hashed googleId as password (for formality)
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ message: "Google Login failed" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = ""; // ✅ clear OTP
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error("🔴 Registration Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login Attempt:", email); // ✅ Debug line

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // ✅ required
      userId: user._id, // ✅ for frontend
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
