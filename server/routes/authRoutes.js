const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your mysql2/promise pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration Route
router.post('/register', async (req, res) => {
    // 1. Destructure all fields sent from the frontend
    const { full_name, email, password, phone, profile_img_url } = req.body;

    // Basic validation
    if (!full_name || !email || !password || !phone) {
        return res.status(400).json({ message: "Please fill in all required fields." });
    }

    try {
        // 2. Check if user already exists
        const [existingUser] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered." });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Insert into MySQL matching your schema columns
        // Schema: user_id (auto), full_name, email, password_hash, phone, profile_img_url, avg_rating (default), created_at (default)
        const sql = `
            INSERT INTO users (full_name, email, password_hash, phone, profile_img_url) 
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(sql, [
            full_name, 
            email, 
            hashedPassword, 
            phone, 
            profile_img_url || null // Fallback to null if not provided
        ]);

        res.status(201).json({ 
            success: true,
            message: "User registered successfully!" 
        });

    } catch (err) {
        console.error("REGISTRATION ERROR:", err.message);
        res.status(500).json({ 
            error: "Database error during registration", 
            details: err.message 
        });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Basic Validation
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    try {
        // 2. Fetch user from MySQL by email
        // We select the password_hash specifically to compare it
        const [users] = await db.execute(
            'SELECT user_id, full_name, email, password_hash, profile_img_url FROM users WHERE email = ?', 
            [email]
        );

        // 3. Check if user exists
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = users[0];

        // 4. Compare the plain text password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 5. Create a JWT Token (Optional but recommended for EcoLend)
        // Ensure you have JWT_SECRET in your .env file
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

        // 6. Return success with user data (excluding the hash!)
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.user_id,
                name: user.full_name,
                email: user.email,
                avatar: user.profile_img_url
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err.message);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;