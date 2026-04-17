const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/add', async (req, res) => {
  const { title, description, category, price_per_day, location_lat, location_lng, image_url } = req.body;

  try {
    // IMPORTANT: For now, we assume owner_id = 1 (your first user).
    // Once login is ready, this will come from req.user.id
    const owner_id = 1; 

    const sql = `
      INSERT INTO items 
      (owner_id, title, description, category, price_per_day, location_lat, location_lng, image_url, is_available) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      owner_id,
      title,
      description,
      category, // Must be one of: 'Tools', 'Electronics', 'Kitchen', 'Camping', 'Photography'
      price_per_day || 0.00,
      location_lat || null,
      location_lng || null,
      image_url || null,
      true // is_available defaults to true
    ]);

    res.status(201).json({ message: "Item listed successfully", itemId: result.insertId });
  } catch (error) {
    console.error("MySQL Insert Error:", error.message);
    res.status(500).json({ error: "Database failure", details: error.message });
  }
});

// Get a single item by ID
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

module.exports = router;