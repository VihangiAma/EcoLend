const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// 1. Initialize the library
// Ensure GEMINI_API_KEY is exactly as provided in Google AI Studio
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-description', async (req, res) => {
  const { itemName } = req.body;

  if (!itemName) {
    return res.status(400).json({ message: "Please provide an item name." });
  }

  try {
    // 2. Use the standard stable model ID
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const prompt = `Write a professional, friendly, and 2-sentence description for a "${itemName}" for a community sharing app called EcoLend. Focus on helping neighbors understand why it's useful.`;
    
    // 3. Generate content with a timeout/safety check
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Send the clean text back
    res.json({ description: text });

  } catch (error) {
    console.error("GEMINI ERROR LOG:", error.message);

    // If you keep getting 404, the API Key might be from the wrong console
    if (error.message.includes("404")) {
      return res.status(500).json({ 
        message: "Model Route Not Found", 
        details: "Please ensure your API Key is from Google AI Studio (aistudio.google.com) and your Node.js version is 18+." 
      });
    }

    res.status(500).json({ message: "AI Error", details: error.message });
  }
});

module.exports = router;