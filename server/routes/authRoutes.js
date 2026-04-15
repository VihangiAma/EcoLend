const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Registration Route
router.post('/register', async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into MySQL
        await db.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
            [full_name, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;