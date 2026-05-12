const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');

// Register
const upload = require('../config/multer');

router.post('/register', upload.single('profile_img'), async (req, res) => {
  const { full_name, email, password, phone } = req.body;
  const profile_img_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash, phone, profile_img_url) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, phone, profile_img_url]
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});



// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user: { id: user.user_id, name: user.full_name } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

module.exports = router;
