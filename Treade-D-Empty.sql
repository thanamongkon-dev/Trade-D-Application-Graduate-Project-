-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               11.3.0-MariaDB-log - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for main_app
CREATE DATABASE IF NOT EXISTS `main_app` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;
USE `main_app`;

-- Dumping structure for table main_app.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table main_app.chats
CREATE TABLE IF NOT EXISTS `chats` (
  `chat_id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `message_text` text DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `type` enum('text','image') NOT NULL DEFAULT 'text',
  PRIMARY KEY (`chat_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table main_app.images
CREATE TABLE IF NOT EXISTS `images` (
  `image_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) DEFAULT NULL,
  `image_key` text DEFAULT NULL,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3017 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table main_app.items
CREATE TABLE IF NOT EXISTS `items` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `condition` text DEFAULT NULL,
  `create_at` datetime DEFAULT current_timestamp(),
  `status` enum('Pending','Complete','Cancel') DEFAULT 'Pending',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table main_app.offers
CREATE TABLE IF NOT EXISTS `offers` (
  `offer_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NOT NULL DEFAULT 0,
  `wisher_id` int(11) NOT NULL DEFAULT 0 COMMENT 'เจ้าของโพส',
  `user_offer_id` int(11) NOT NULL DEFAULT 0 COMMENT 'ผู้มาเสนอแลกเปลี่ยน',
  `condition` text NOT NULL,
  `preview_image` text NOT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`offer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table main_app.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL DEFAULT 'Male',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 0,
  `bio` varchar(255) DEFAULT 'ผู้ใช้ยังไม่ได้ตั้ง BIO',
  `profile` varchar(255) DEFAULT 'https://trade-d-api.onrender.com/guest.png',
  `last_login` datetime DEFAULT NULL,
  `last_ip` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=1004 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for procedure main_app.AllPostToCard
DELIMITER //
CREATE PROCEDURE `AllPostToCard`()
BEGIN
	SELECT items.* ,items.name AS item_name, images.image_key,p.name,p.profile
	FROM items
	LEFT JOIN images ON items.item_id = images.item_id
	RIGHT JOIN users p ON items.user_id = p.user_id
	GROUP BY items.item_id ORDER BY items.item_id DESC;
END//
DELIMITER ;

-- Dumping structure for procedure main_app.Auth
DELIMITER //
CREATE PROCEDURE `Auth`(
	IN `p_email` VARCHAR(50),
	IN `p_password` VARCHAR(255),
	IN `p_new_ip` VARCHAR(50)
)
BEGIN
	-- Declare variables to store user data
	DECLARE v_uid INT;
   DECLARE v_email VARCHAR(50);
   DECLARE v_last_login DATETIME;
   
   -- Check if the username and password match
   SELECT u.user_id , u.email, u.last_login INTO v_uid, v_email, v_last_login
   FROM users u
   WHERE u.email = p_email AND u.`password` = p_password;
   
   IF v_uid IS NOT NULL THEN
      -- Update the last_ip for the matching user
      UPDATE users l
      SET l.last_ip = p_new_ip, l.last_login = NOW()
      WHERE l.user_id = v_uid;
        
      SELECT u.user_id, u.name, u.gender, u.email, u.phone, u.location, u.rating, u.bio, u.profile FROM users u WHERE u.user_id = v_uid;
   ELSE
      SELECT 'Invalid username or password.' AS result;
   END IF;   
END//
DELIMITER ;

-- Dumping structure for procedure main_app.DeletePost
DELIMITER //
CREATE PROCEDURE `DeletePost`(
	IN `p_postId` INT
)
BEGIN
	DELETE FROM images WHERE item_id = p_postId;
	DELETE FROM items WHERE item_id = p_postId;
END//
DELIMITER ;

-- Dumping structure for procedure main_app.GetChat
DELIMITER //
CREATE PROCEDURE `GetChat`(
	IN `user_id_param` INT
)
BEGIN
    SELECT
  chat_partner,
  u.name,
  u.profile,
  MAX(timestamp) AS last_message_timestamp,
  SUBSTRING_INDEX(GROUP_CONCAT(message_text ORDER BY timestamp DESC), ',', 1) AS last_message,
  SUBSTRING_INDEX(GROUP_CONCAT(type ORDER BY timestamp DESC), ',', 1) AS last_message_type
FROM (
  SELECT
    chat_id,
    CASE
        WHEN sender_id = user_id_param THEN receiver_id
        WHEN receiver_id = user_id_param THEN sender_id
      END AS chat_partner,
    message_text,
    timestamp,
    type
  FROM chats
  WHERE sender_id = user_id_param OR receiver_id = user_id_param
) AS user_chats
INNER JOIN users u ON user_chats.chat_partner = u.user_id
GROUP BY chat_partner
ORDER BY last_message_timestamp DESC;
END//
DELIMITER ;

-- Dumping structure for procedure main_app.PostDetail
DELIMITER //
CREATE PROCEDURE `PostDetail`(
	IN `p_item_id` INT
)
BEGIN
	SELECT
	  p.item_id,
	  p.name,p.`condition`,p.description,p.category_id,
	  JSON_ARRAYAGG(
	    JSON_OBJECT('image_id', i.image_id, 'image_key', i.image_key)
		  ) AS images
	FROM items p
	LEFT JOIN images i ON p.item_id = i.item_id
	WHERE p.item_id = p_item_id
	GROUP BY p.item_id, p.description;
END//
DELIMITER ;

-- Dumping structure for procedure main_app.PostToCard
DELIMITER //
CREATE PROCEDURE `PostToCard`(
	IN `u_uid` INT
)
BEGIN
	SELECT
          i.item_id,
          u.user_id,
          u.name,
          u.profile,
          i.name AS item_name,
          i.description,
          i.condition,
          i.category_id,
          i.create_at,
          i.status,
        GROUP_CONCAT(img.image_id) AS image_ids,
        GROUP_CONCAT(img.image_key) AS image_keys
        FROM
          items AS i
        LEFT JOIN
          images AS img ON i.item_id = img.item_id
        LEFT JOIN
          users AS u ON i.user_id = u.user_id
      	WHERE i.user_id = u_uid
        GROUP BY
          i.item_id
        ORDER BY
          i.item_id DESC
          LIMIT 200
        ;
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
