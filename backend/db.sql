DROP DATABASE IF EXISTS algoviz_db;
CREATE DATABASE algoviz_db;
USE algoviz_db;

-- CREATE USERS TABLE (Covers DDL & Normalization)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE ACTIVITY LOGS TABLE (Covers Foreign Keys)
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    algorithm_type VARCHAR(50) NOT NULL,
    algorithm_name VARCHAR(50) NOT NULL,
    execution_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CREATE A TRIGGER
-- When a user runs an algo, automatically update their 'last_active' time
DELIMITER //
CREATE TRIGGER update_last_active
AFTER INSERT ON activity_logs
FOR EACH ROW
BEGIN
    UPDATE users SET last_active = NOW() WHERE id = NEW.user_id;
END;
//
DELIMITER ;

-- CREATE A STORED PROCEDURE
-- Wraps 3 queries into 1 function call for the dashboard
DELIMITER //
CREATE PROCEDURE get_user_dashboard(IN input_user_id INT)
BEGIN
    -- Result 0: Total Count
    SELECT COUNT(*) as total FROM activity_logs WHERE user_id = input_user_id;
    
    -- Result 1: Favorite Algorithm
    SELECT algorithm_name, COUNT(*) as count 
    FROM activity_logs 
    WHERE user_id = input_user_id 
    GROUP BY algorithm_name 
    ORDER BY count DESC LIMIT 1;
    
    -- Result 2: Recent History
    SELECT algorithm_type, algorithm_name, execution_time 
    FROM activity_logs 
    WHERE user_id = input_user_id 
    ORDER BY execution_time DESC LIMIT 5;
END;
//
DELIMITER ;