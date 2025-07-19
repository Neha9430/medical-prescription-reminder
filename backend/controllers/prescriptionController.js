// controllers/prescriptionController.js

import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import vision from "@google-cloud/vision";
import { extractPrescriptionData } from "../utils/parsePrescriptionGemini.js";
import Prescription from "../models/Prescription.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const client = new vision.ImageAnnotatorClient({
  credentials,
});


export const getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.user._id;

    // prescriptions model import करके यूज़र के हिस्ट्री fetch करो
    const prescriptions = await Prescription.find({ userId }); // अगर userId store करते हो
    res.json({ prescriptions });
  } catch (error) {
    console.error("🔴 Error fetching prescriptions:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE a prescription by ID
export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await Prescription.findByIdAndDelete(id);
    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete prescription", error: err.message });
  }
};



export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = req.file.path;

    // OCR using Google Vision
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    const extractedText = detections.length ? detections[0].description : "";

    // Delete image
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });

    if (!extractedText) {
      return res.status(400).json({ message: "No text detected in image" });
    }

    console.log("Extracted Text:", extractedText);

    // AI parsing
    const parsedData = await extractPrescriptionData(extractedText);
    console.log("🔍 Gemini Raw Output:", parsedData);

    // ✅ Ensure medicines are saved in correct format
    const formattedMedicines = Array.isArray(parsedData.medicines)
      ? parsedData.medicines.map((med) => ({
          name: med,
          dosage: "",
          timing: "",
          reminderTime: "",
        }))
      : [];

    // Save to MongoDB
    const newPrescription = new Prescription({
      patientName: parsedData.patientName,
      doctorName: parsedData.doctorName,
      date: parsedData.date,
      bp: parsedData.bp,
      spo2: parsedData.spo2,
      medicines: formattedMedicines,
      user: req.user._id,
    });

    await newPrescription.save();

    res.status(200).json({
      message: "OCR and AI parsing successful and data saved to MongoDB!",
      data: parsedData,
    });
  } catch (error) {
    console.error("❌ Google Vision OCR Error:", error);
    res.status(500).json({
      message: "OCR failed",
      error: error.message,
    });
  }
};
