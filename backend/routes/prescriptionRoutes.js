import express from "express";
import upload from "../middleware/uploadMiddleware.js"; 
import { uploadPrescription, deletePrescription } from "../controllers/prescriptionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserPrescriptions } from "../controllers/prescriptionController.js";


const router = express.Router();

router.post("/upload-prescription", authMiddleware, upload.single("image"), uploadPrescription); 
router.post("/upload", authMiddleware, uploadPrescription);
router.get("/history", authMiddleware, getUserPrescriptions);
router.delete("/delete/id", deletePrescription);

export default router;
