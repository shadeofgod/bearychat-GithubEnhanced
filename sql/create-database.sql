-- Create a new database called 'bearychat_github_enhanced'
-- Create the new database if it does not exist already
CREATE DATABASE IF NOT EXISTS bearychat_github_enhanced;

USE bearychat_github_enhanced;

CREATE TABLE `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(10),
  `team_id` VARCHAR(10),
  `token` VARCHAR(100),
  PRIMARY KEY (`id`)
);
