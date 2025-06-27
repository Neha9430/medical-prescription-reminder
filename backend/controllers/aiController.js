import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getMedicinePurpose = async (req, res) => {
  const { medicineName } = req.body;

  if (!medicineName) {
    return res.status(400).json({ success: false, message: "Medicine name is required" });
  }

  const prompt = `
You are an expert doctor.

Explain in 1 line what is the purpose of medicine "${medicineName}".
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!answer) {
      return res.status(500).json({ success: false, message: "No answer returned from Gemini AI" });
    }

    return res.status(200).json({ success: true, purpose: answer });

  } catch (err) {
    console.error("❌ Gemini API Error:", err?.response?.data || err.message);
    return res.status(500).json({ success: false, message: "Failed to get answer from AI" });
  }
};
