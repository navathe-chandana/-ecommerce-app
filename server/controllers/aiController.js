import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateDescription = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const prompt = `Write a compelling, concise e-commerce product description (2-3 sentences) for a product called "${name}"${category ? ` in the "${category}" category` : ""}. Focus on benefits and appeal to shoppers. Do not use markdown formatting.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    const description = completion.choices[0].message.content;

    res.json({ description });
  } catch (error) {
    console.error("AI generation error:", error);
    res.status(500).json({ message: "Failed to generate description" });
  }
};