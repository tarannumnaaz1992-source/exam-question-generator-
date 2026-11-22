import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64, mimeType, subject } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    const prompt = `Create 1-mark, 2-mark, 3-mark, 4-mark, and 5-mark exam questions with step-by-step solutions from this image (${subject || "Study topic"}). Use $...$ for math formulas and bold final answers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        prompt,
        { inlineData: { data: imageBase64, mimeType: mimeType || "image/jpeg" } }
      ]
    });

    res.status(200).json({ result: response.text });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate questions" });
  }
}
