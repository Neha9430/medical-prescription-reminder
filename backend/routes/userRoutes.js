import express from "express";
import { registerUser, loginUser ,googleLoginUser} from "../controllers/userController.js";
import {
  forgotPassword,
  resetPassword,
  
} from "../controllers/forgotPasswordController.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import { getUserHistory } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google-login", googleLoginUser);
router.get("/history", authMiddleware, getUserHistory);

export default router;
