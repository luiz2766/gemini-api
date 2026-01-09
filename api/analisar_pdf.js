import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { fileBase64 } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: "fileBase64 ausente" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: "Teste simples" }],
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      text: result.text,
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({
      error: err.message || "Erro interno",
    });
  }
}
