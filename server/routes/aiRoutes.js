const express = require('express');
const router = express.Router();
const GroqSDK = require('groq-sdk');
const Groq = GroqSDK.Groq || GroqSDK; 

router.post('/generate-description', async (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: "No title provided" });

  try {
    // Dynamically instantiate with the loaded key when the request arrives
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
      model: "llama-3.1-8b-instant", 
    });

    const description = chatCompletion.choices[0]?.message?.content || "";
    return res.json({ description: description.trim() });

  } catch (error) {
    console.error("❌ GROQ ERROR DETAILS:", error.message);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;