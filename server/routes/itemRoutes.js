const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/auth');

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

// ADVANCED BROWSE & SEARCH FILTERING
router.get('/all', async (req, res) => {
    const { category, search, maxPrice, sortBy } = req.query; 
    
    try {
        let sql = `
            SELECT items.*, users.full_name as owner_name 
            FROM items 
            LEFT JOIN users ON items.owner_id = users.user_id
        `;
        const params = [];
        let conditions = [];

        // 1. Category Filter
        if (category && category !== "All") {
            conditions.push("items.category = ?");
            params.push(category);
        }

        // 2. Search Filter (Title or Description)
        if (search && search.trim() !== "") {
            const searchTerm = `%${search}%`; 
            conditions.push("(items.title LIKE ? OR items.description LIKE ?)");
            params.push(searchTerm, searchTerm);
        }

        // 3. Max Price Filter
        if (maxPrice) {
            conditions.push("items.price_per_day <= ?");
            params.push(Number(maxPrice));
        }

        // Combine all active conditions
        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        // 4. Dynamic Sorting Configurations
        if (sortBy === 'price_low') {
            sql += " ORDER BY items.price_per_day ASC";
        } else if (sortBy === 'price_high') {
            sql += " ORDER BY items.price_per_day DESC";
        } else if (sortBy === 'rating') {
            sql += " ORDER BY items.rating DESC"; // Assumes a rating column exists
        } else {
            sql += " ORDER BY items.item_id DESC"; // Default: Newest listings first
        }

        const [rows] = await db.execute(sql, params);
        res.json(rows);
    } catch (err) {
        console.error("Advanced Search Error:", err.message);
        res.status(500).json({ error: "Failed to search items" });
    }
});

// GET authenticated user's items
router.get('/my', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM items WHERE owner_id = ? ORDER BY item_id DESC', [req.userId]);
    res.json(rows);
  } catch (err) {
    console.error('Fetch user items error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user items' });
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

// Update item by ID
router.put('/:id', verifyToken, async (req, res) => {
  const { title, description, category, price_per_day, image_url } = req.body;
  const itemId = req.params.id;

  try {
    await db.execute(
      `UPDATE items
       SET title = ?, description = ?, category = ?, price_per_day = ?, image_url = COALESCE(?, image_url)
       WHERE item_id = ? AND owner_id = ?`,
      [title, description, category, price_per_day, image_url, itemId, req.userId]
    );
    res.json({ success: true, message: 'Item updated successfully' });
  } catch (err) {
    console.error('Update item error:', err.message);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Toggle item status
router.patch('/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body;
  const itemId = req.params.id;

  try {
    await db.execute(
      `UPDATE items SET status = ? WHERE item_id = ? AND owner_id = ?`,
      [status, itemId, req.userId]
    );
    res.json({ success: true, message: 'Item status updated' });
  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).json({ error: 'Failed to update item status' });
  }
});

// Delete item by ID
router.delete('/:id', verifyToken, async (req, res) => {
  const itemId = req.params.id;

  try {
    await db.execute(`DELETE FROM items WHERE item_id = ? AND owner_id = ?`, [itemId, req.userId]);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete item error:', err.message);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Add new item
// ✅ Added verifyToken middleware to dynamically read the logged-in user
router.post('/add', verifyToken, upload.single('image'), async (req, res) => {
    const { title, description, category, price_per_day, location_name, location_lat, location_lng } = req.body;
    
    // ✅ FIX: Extract the dynamic logged-in user's ID from the token request state
    const owner_id = req.userId; 
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
        console.error("Listing submission error:", err.message);
        res.status(500).json({ error: "Failed to save item" });
    }
});

module.exports = router;