const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/auth');

// 0. Create or get conversation with another user
router.post('/create-conversation', verifyToken, async (req, res) => {
    try {
        const { peer_id, item_id } = req.body;
        const userId = req.userId;

        console.log('Creating conversation - userId:', userId, 'peer_id:', peer_id);

        if (!peer_id) {
            return res.status(400).json({ error: 'Peer ID is required' });
        }

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Create conversation_id as composite key (smaller id first for consistency)
        const conversationId = userId < peer_id ? `${userId}_${peer_id}` : `${peer_id}_${userId}`;
        console.log('Generated conversation ID:', conversationId);

        // Check if conversation already exists
        const checkSql = `SELECT conversation_id FROM conversations WHERE conversation_id = ?`;
        
        console.log('Checking for existing conversation...');
        const [existing] = await db.execute(checkSql, [conversationId]);
        
        if (existing.length > 0) {
            console.log('Existing conversation found:', conversationId);
            return res.json({ conversationId: conversationId });
        }

        // Create new conversation
        console.log('Creating new conversation...');
        const createSql = `
            INSERT INTO conversations (conversation_id, user_one_id, user_two_id, updated_at)
            VALUES (?, ?, ?, NOW())
        `;
        
        await db.execute(createSql, [conversationId, Math.min(userId, peer_id), Math.max(userId, peer_id)]);
        console.log('Conversation created with ID:', conversationId);
        res.json({ conversationId: conversationId });
    } catch (err) {
        console.error('❌ Error creating conversation:', err);
        res.status(500).json({ error: 'Failed to create conversation', details: err.message });
    }
});

// 1. Get all conversations for the authenticated user
router.get('/conversations', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const sql = `
            SELECT 
                c.conversation_id,
                c.user_one_id,
                c.user_two_id,
                c.updated_at,
                m.text AS last_message,
                m.timestamp AS last_message_time,
                u.user_id AS peer_id,
                u.full_name AS peer_name,
                u.profile_img_url AS peer_avatar
            FROM conversations c
            LEFT JOIN users u ON (
                (c.user_one_id = ? AND u.user_id = c.user_two_id) 
                OR (c.user_two_id = ? AND u.user_id = c.user_one_id)
            )
            LEFT JOIN messages m ON m.conversation_id = c.conversation_id 
                AND m.timestamp = (
                    SELECT MAX(timestamp) FROM messages 
                    WHERE conversation_id = c.conversation_id
                )
            WHERE c.user_one_id = ? OR c.user_two_id = ?
            ORDER BY COALESCE(m.timestamp, c.updated_at) DESC
        `;
        const [conversations] = await db.execute(sql, [userId, userId, userId, userId]);
        console.log('Fetched conversations:', conversations.length);
        res.json(conversations);
    } catch (err) {
        console.error('❌ Error fetching conversations:', err);
        res.status(500).json({ error: 'Failed to fetch channels', details: err.message });
    }
});

// 2. Get messages inside a single conversation channel
router.get('/:conversationId', verifyToken, async (req, res) => {
    try {
        const sql = `
            SELECT m.id as message_id, m.sender_id, m.text as message_text, m.timestamp as created_at, u.full_name AS sender_name 
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.user_id
            WHERE m.conversation_id = ?
            ORDER BY m.timestamp ASC
        `;
        const [messages] = await db.execute(sql, [req.params.conversationId]);
        console.log('Fetched messages:', messages.length);
        res.json(messages);
    } catch (err) {
        console.error('❌ Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch chat log', details: err.message });
    }
});

// 3. Post a message to a channel
router.post('/send', verifyToken, async (req, res) => {
    const { conversationId, text } = req.body;
    try {
        if (!conversationId || !text) {
            return res.status(400).json({ error: 'Conversation ID and text are required' });
        }

        const [result] = await db.execute(
            'INSERT INTO messages (conversation_id, sender_id, text, timestamp) VALUES (?, ?, ?, NOW())',
            [conversationId, req.userId, text]
        );
        
        // Update conversation updated_at timestamp
        await db.execute(
            'UPDATE conversations SET updated_at = NOW() WHERE conversation_id = ?',
            [conversationId]
        );
        
        console.log('Message saved with ID:', result.insertId);
        res.status(201).json({ success: true, messageId: result.insertId });
    } catch (err) {
        console.error('❌ Error sending message:', err);
        res.status(500).json({ error: 'Failed to transmit message', details: err.message });
    }
});

module.exports = router;