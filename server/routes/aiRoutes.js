const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
require('dotenv').config();

// Initialize Groq with your API Key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/generate-description', async (req, res) => {
    const { itemName } = req.body;

    if (!itemName) {
        return res.status(400).json({ message: "Item name is required" });
    }

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant for EcoLend, a neighborhood sharing app in Sri Lanka. Write catchy, short rental descriptions (max 2 sentences)."
                },
                {
                    role: "user",
                    content: `Write a rental description for a "${itemName}". Mention it is well-maintained.`
                }
            ],
            model: "llama-3.1-8b-instant", 
            temperature: 0.7,
            max_tokens: 100
        });

        // Extract the text from the response
        const aiText = chatCompletion.choices[0]?.message?.content || "";
        
        res.json({ description: aiText.trim() });

    } catch (error) {
        console.error("Groq AI Error:", error.message);
        res.status(500).json({ 
            message: "AI generation failed", 
            error: error.message 
        });
    }
});

module.exports = router;