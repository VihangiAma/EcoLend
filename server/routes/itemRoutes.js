const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// FIX: Changed from '/' to '/all' and added category filtering
router.get('/all', async (req, res) => {
    const { category } = req.query; // Capture the ?category=Tools from frontend
    
    try {
        let sql = `
            SELECT items.*, users.full_name as owner_name 
            FROM items 
            LEFT JOIN users ON items.owner_id = users.user_id
        `;
        const params = [];

        // Add filter if a specific category is selected
        if (category && category !== "All") {
            sql += " WHERE items.category = ?";
            params.push(category);
        }

        sql += " ORDER BY items.item_id DESC";

        const [rows] = await db.execute(sql, params);
        res.json(rows); // This returns the array your ItemList.jsx expects
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET single item by ID
router.get('/:id', async (req, res) => {
  try {
      const [rows] = await db.execute(`
          SELECT items.*, users.full_name as owner_name, users.profile_img_url as owner_avatar 
          FROM items 
          JOIN users ON items.owner_id = users.user_id 
          WHERE items.item_id = ?`, 
          [req.params.id]
      );
      if (rows.length === 0) return res.status(404).json({ message: "Item not found" });
      res.json(rows[0]);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Add new item
router.post('/add', upload.single('image'), async (req, res) => {
    const { title, description, category, price_per_day, location_name, location_lat, location_lng } = req.body;
    const owner_id = 1; 
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const sql = `
            INSERT INTO items 
            (owner_id, title, description, category, price_per_day, location_name, location_lat, location_lng, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.execute(sql, [owner_id, title, description, category, price_per_day, location_name || 'Unknown', location_lat || null, location_lng || null, image_url]);
        res.status(201).json({ success: true, message: "Listing created successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save item" });
    }
});

module.exports = router;