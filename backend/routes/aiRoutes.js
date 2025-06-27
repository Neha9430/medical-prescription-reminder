import express from "express";
import { getMedicinePurpose } from "../controllers/aiController.js";

const router = express.Router();

router.post("/medicine-purpose", getMedicinePurpose);

export default router;
