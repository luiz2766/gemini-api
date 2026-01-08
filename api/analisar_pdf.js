import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { base64Pdf } = req.body;

    if (!base64Pdf) {
      return res.status(400).json({ error: "PDF não recebido" });
    }

    if (!process.env.API_KEY) {
      return res.status(500).json({ error: "API_KEY não configurada" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.API_KEY
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: "Extraia os dados e retorne JSON estrito." },
          { inlineData: { data: base64Pdf, mimeType: "application/pdf" } }
        ]
      }
    });

    res.status(200).json({ text: response.text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
