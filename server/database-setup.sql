-- ========================================================
-- EcoLend Database Schema - Chat/Message Tables
-- ========================================================

-- 1. CONVERSATIONS TABLE
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

-- 2. MESSAGES TABLE
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
-- NOTES:
-- ========================================================
-- Run this SQL script to create the necessary tables for real-time chat functionality.
-- Make sure the 'users' and 'items' tables already exist.
--
-- To run:
-- mysql -u root -p resource_share_db < database-setup.sql
-- ========================================================
