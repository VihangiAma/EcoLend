const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Built-in, no install needed
const upload = require('../config/multer');
const verifyToken = require('../middleware/auth');

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail
    pass: 'your-app-password'     // Replace with your 16-character App Password
  }
});

// 1. REGISTER
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

// 2. LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.full_name,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        profile_img_url: user.profile_img_url || null
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// 3. PROFILE GET
router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id AS id, full_name AS fullName, email, phone, profile_img_url FROM users WHERE user_id = ?',
      [req.userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});

// 4. PROFILE UPDATE
router.put('/me', verifyToken, async (req, res) => {
  const { full_name, email, phone } = req.body;
  try {
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ? AND user_id != ?', [email, req.userId]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email is already in use' });

    await db.query(
      'UPDATE users SET full_name = ?, email = ?, phone = ? WHERE user_id = ?',
      [full_name, email, phone, req.userId]
    );

    const [rows] = await db.query(
      'SELECT user_id AS id, full_name AS fullName, email, phone, profile_img_url FROM users WHERE user_id = ?',
      [req.userId]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

// 5. FORGOT PASSWORD (THIS WAS MISSING)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Use user_id as that is your primary key name in the table
    await db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    
    await transporter.sendMail({
      from: '"EcoLend Support" <your-email@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });

    res.json({ message: "Reset link sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 4. RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token]
    );

    if (users.length === 0) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure we use user_id to match your table schema
    await db.query(
      "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?",
      [hashedPassword, users[0].user_id]
    );

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
});
// ==========================================
//          ACCOUNT SETTINGS CORES
// ==========================================

// 1. UPDATE ECOSYSTEM PREFERENCES & LOGISTICS
router.put('/settings', verifyToken, async (req, res) => {
  const { is_away, preferred_handoff, ai_matching } = req.body;
  
  try {
    const sql = `
      UPDATE users 
      SET is_away = ?, preferred_handoff = ?, ai_matching = ? 
      WHERE user_id = ?
    `;
    
    // Normalize parameters for tinyint/boolean entry matching your schema
    await db.query(sql, [
      is_away ? 1 : 0, 
      preferred_handoff || 'Meetup', 
      ai_matching ? 1 : 0, 
      req.userId
    ]);

    res.json({ success: true, message: "Ecosystem configurations updated successfully!" });
  } catch (err) {
    console.error("Settings preferences update failure:", err.message);
    res.status(500).json({ error: "Failed to update portal settings preference states." });
  }
});

// 2. PASSWORD SECURITY CHANGE INTERFACE
router.put('/settings/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new passwords are required." });
  }

  try {
    // Fetch the correct password_hash column parameter
    const [users] = await db.query('SELECT password_hash FROM users WHERE user_id = ?', [req.userId]);
    if (users.length === 0) return res.status(404).json({ error: "User session context not found." });

    const user = users[0];

    // FIX: Swapped over to bcryptjs to track your primary dependency configuration
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "The current password you typed is incorrect." });

    // Encrypt the fresh credential payload matching your setup factor (10 rounds)
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Persist changes down to your database
    await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [newHashedPassword, req.userId]);

    res.json({ success: true, message: "Your account security password has been updated successfully!" });
  } catch (err) {
    console.error("Credential modification track failure:", err.message);
    res.status(500).json({ error: "Internal server error updating credentials." });
  }
});

// 3. IDENTITY DOCUMENT UPLOAD (NIC / TRUST BADGE PROGRESS)
router.post('/settings/verify-identity', verifyToken, upload.single('identity_doc'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Please select an identity verification document file to upload." });
  }

  // Uses your global multer config to resolve asset paths
  const identity_doc_url = `/uploads/${req.file.filename}`;

  try {
    const sql = `
      UPDATE users 
      SET identity_doc_url = ?, verification_status = 'Pending Review' 
      WHERE user_id = ?
    `;
    await db.query(sql, [identity_doc_url, req.userId]);

    res.json({ 
      success: true, 
      message: "Identity documentation submitted successfully. Verification status is now Pending Review.",
      docUrl: identity_doc_url
    });
  } catch (err) {
    console.error("Trust layer documentation upload failure:", err.message);
    res.status(500).json({ error: "Failed to upload identity verification file parameters matrix." });
  }
});

module.exports = router;