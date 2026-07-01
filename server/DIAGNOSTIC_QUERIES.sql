-- ========================================================
-- EcoLend Chat Diagnostic Queries
-- ========================================================

-- Run these queries to diagnose the chat issue

-- 1. Check if conversation tables exist
SHOW TABLES LIKE 'conversations';
SHOW TABLES LIKE 'messages';

-- 2. Check the structure of items table (to verify owner_id column exists)
DESCRIBE items;

-- 3. Check if any conversations exist
SELECT COUNT(*) as conversation_count FROM conversations;

-- 4. Check user count
SELECT COUNT(*) as user_count FROM users;

-- 5. Check items with owner info
SELECT item_id, title, owner_id, user_id FROM items LIMIT 5;

-- 6. If above doesn't work, check column names in items table
SHOW COLUMNS FROM items;

-- 7. List all tables in the database
SHOW TABLES;

-- ========================================================
-- IF TABLES DON'T EXIST, RUN THIS:
-- ========================================================

CREATE TABLE IF NOT EXISTS conversations (
  conversation_id INT PRIMARY KEY AUTO_INCREMENT,
  user_one_id INT NOT NULL,
  user_two_id INT NOT NULL,
  item_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_one_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (user_two_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE SET NULL,
  INDEX idx_users (user_one_id, user_two_id),
  INDEX idx_updated (updated_at)
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_created (created_at)
);

-- ========================================================
-- THEN VERIFY CREATION
-- ========================================================

SELECT 'conversations table' as table_name, COUNT(*) as row_count FROM conversations
UNION ALL
SELECT 'messages table', COUNT(*) FROM messages;
