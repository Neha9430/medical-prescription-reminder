import { parsePrescriptionText } from "../utils/parsePrescriptionText.js";

export const handleOCRResult = (req, res) => {
    const { extractedText } = req.body;

    console.log("Raw OCR Text:", extractedText);

    if(!extractedText) {
        return res.status(400).json({ message: "No OCR text provided" });
    }

    const parsedData = parsePrescriptionText(extractedText);

    return res.status(200).json({
        message: "Parsed Successfully",
        data: parsedData
    });
};