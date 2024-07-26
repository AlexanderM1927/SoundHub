-- Adminer 4.8.1 MySQL 8.3.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `bans`;
CREATE TABLE `bans` (
  `ban_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `responsable_user_id` int NOT NULL,
  `ban_reason` varchar(255) DEFAULT NULL,
  `ban_expires` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`ban_id`),
  KEY `user_id` (`user_id`),
  KEY `responsable_user_id` (`responsable_user_id`),
  CONSTRAINT `bans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `bans_ibfk_2` FOREIGN KEY (`responsable_user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_msg` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  `playlist_id` int DEFAULT NULL,
  `sound_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `playlist_id` (`playlist_id`),
  KEY `sound_id` (`sound_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`sound_id`) REFERENCES `sounds` (`sound_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `favorite_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `playlist_id` int DEFAULT NULL,
  `sound_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`favorite_id`),
  KEY `user_id` (`user_id`),
  KEY `playlist_id` (`playlist_id`),
  KEY `sound_id` (`sound_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON UPDATE CASCADE,
  CONSTRAINT `favorites_ibfk_3` FOREIGN KEY (`sound_id`) REFERENCES `sounds` (`sound_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `like_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `comment_id` int DEFAULT NULL,
  `playlist_id` int DEFAULT NULL,
  `sound_id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`like_id`),
  KEY `user_id` (`user_id`),
  KEY `comment_id` (`comment_id`),
  KEY `playlist_id` (`playlist_id`),
  KEY `sound_id` (`sound_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_4` FOREIGN KEY (`sound_id`) REFERENCES `sounds` (`sound_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `playlists`;
CREATE TABLE `playlists` (
  `playlist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `playlist_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`playlist_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` (`role_id`, `role_name`, `createdAt`, `updatedAt`) VALUES
(1,	'user',	'2024-03-13 18:10:50',	'2024-03-13 18:10:50'),
(2,	'moderator',	'2024-03-13 18:10:50',	'2024-03-13 18:10:50'),
(3,	'admin',	'2024-03-13 18:10:50',	'2024-03-13 18:10:50');

DROP TABLE IF EXISTS `sounds`;
CREATE TABLE `sounds` (
  `sound_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `sound_name` varchar(255) DEFAULT NULL,
  `sound_file_url` varchar(255) DEFAULT NULL,
  `sound_thumbnail_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sound_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sounds_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `sounds_playlists`;
CREATE TABLE `sounds_playlists` (
  `sound_playlist_id` int NOT NULL AUTO_INCREMENT,
  `youtube_id` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sound_id` int DEFAULT NULL,
  `playlist_id` int DEFAULT NULL,
  PRIMARY KEY (`sound_playlist_id`),
  UNIQUE KEY `sounds_playlists_playlist_id_sound_id_unique` (`sound_id`,`playlist_id`),
  KEY `playlist_id` (`playlist_id`),
  CONSTRAINT `sounds_playlists_ibfk_1` FOREIGN KEY (`sound_id`) REFERENCES `sounds` (`sound_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sounds_playlists_ibfk_2` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_identify` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_country` varchar(255) DEFAULT NULL,
  `user_phone` varchar(255) DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `views`;
CREATE TABLE `views` (
  `view_id` int NOT NULL AUTO_INCREMENT,
  `playlist_id` int DEFAULT NULL,
  `sound_id` varchar(255) DEFAULT NULL,
  `view_type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`view_id`),
  KEY `playlist_id` (`playlist_id`),
  CONSTRAINT `views_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`playlist_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2024-07-26 03:17:42