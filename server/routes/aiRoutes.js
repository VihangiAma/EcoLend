const express = require('express');
const router = express.Router();
const { Groq } = require('groq-sdk'); // Make sure this is installed
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/generate-description', async (req, res) => {
  const { title } = req.body;

  // 1. Basic validation
  if (!title) return res.status(400).json({ error: "No title provided" });

  try {
    // 2. Check if API Key is actually loaded
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing from .env file");
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a community rental platform called EcoLend."
        },
        {
          role: "user",
          content: `Write a short, engaging rental description for: ${title}. Focus on its usefulness. Max 40 words.`,
        },
      ],
      model: "llama-3.1-8b-instant", // Ensure this model ID is correct
    });

    const description = chatCompletion.choices[0]?.message?.content || "";
    res.json({ description: description.trim() });

  } catch (error) {
    // 3. This will log the REAL error to your VS Code / Terminal
    console.error("❌ GROQ ERROR DETAILS:", error.message);
    
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
});

module.exports = router;