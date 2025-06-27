// /utils/parsePrescriptionGemini.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function extractPrescriptionData(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  // ✅ Step 1: Clean extracted text
  const cleanText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/[^\x20-\x7E]/g, "") // remove non-ASCII garbage
    .replace(/\s+/g, " ") // collapse extra spaces
    .trim();

  // ✅ Step 2: Better prompt without markdown/code blocks
  const prompt = `
You are an expert medical assistant.
From the following prescription text, extract these fields strictly in JSON format:

- patientName
- doctorName
- date
- bp
- spo2
- medicines (extract all medicine names clearly from the text like T. Partop, T. Macpood, Calpal, etc.)

Text:
""" 
${text}
"""

Return JSON only, no explanation or description.
`;


  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Step 3: Gemini का raw text लो
    const rawText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("🔍 Gemini Raw Output:", rawText);

    // ✅ Step 4: केवल JSON वाला हिस्सा extract करो
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    const jsonString = rawText.substring(jsonStart, jsonEnd);

    // ✅ Step 5: Parse it
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(
      "❌ Gemini Parsing Error:",
      error.response?.data || error.message
    );
    return {
      error: "Failed to parse using Gemini API",
      medicines: [],
    };
  }
}
