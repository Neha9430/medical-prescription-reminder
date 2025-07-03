import express from 'express';
import { handleOCRResult } from '../controllers/ocrController.js';

const router = express.Router();

router.post("/parse-ocr",handleOCRResult);

export default router;