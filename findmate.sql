-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 06, 2025 at 03:28 PM
-- Server version: 8.0.35
-- PHP Version: 8.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `findmate`
--

-- --------------------------------------------------------

--
-- Table structure for table `personality_infomation`
--

CREATE TABLE `personality_infomation` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `age` int NOT NULL,
  `maritalstatus` enum('single','inrelationship','married') COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_general_ci NOT NULL,
  `lgbt` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personality_infomation`
--

INSERT INTO `personality_infomation` (`id`, `user_id`, `firstname`, `lastname`, `nickname`, `age`, `maritalstatus`, `gender`, `lgbt`) VALUES
(14, 33, 'Teerapat', 'Chomchoey', 'James', 23, 'single', 'male', 0),
(15, 34, 'a', 'a', 'a', 21, 'inrelationship', 'female', 1),
(16, 35, 'b', 'b', 'b', 34, 'inrelationship', 'male', 0),
(17, 36, 'JamesCompare', 'JamesCompare', 'JamesCompare', 23, 'single', 'male', 0),
(18, 37, 'c', 'c', 'c', 23, 'inrelationship', 'male', 1);

-- --------------------------------------------------------

--
-- Table structure for table `personality_traits`
--

CREATE TABLE `personality_traits` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `sleeping` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cleanliness` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `voice_use` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nightlife` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `other_traits` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personality_traits`
--

INSERT INTO `personality_traits` (`id`, `user_id`, `sleeping`, `cleanliness`, `voice_use`, `nightlife`, `other_traits`) VALUES
(3, 33, 'night', 'very_clean', 'moderate', 'party', NULL),
(4, 34, 'flexible', 'average', 'talkative', 'homebody', NULL),
(5, 35, 'night', 'average', 'moderate', 'homebody', NULL),
(6, 36, 'night', 'very_clean', 'moderate', 'party', NULL),
(7, 37, 'flexible', 'average', 'talkative', 'homebody', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(33, 'James', 'tpcc.general@gmail.com', '$2a$10$RK3oHfJSmiKfTfcgZAfNo.tEnAYBRjWv9gCDicKRvPDSK/z2Ou96a', 'user'),
(34, 'a', 'a@gmail.com', '$2a$10$HnClqd0Divf8KncFzWO1webOabshVRjsS1mtdfLvFNR1Y8K8nCcF2', 'user'),
(35, 'b', 'b@gmail.com', '$2a$10$19xOoFvBFrmImL88o9QEdu7FPWCASNHdD4UZdIYG1cW69QLC1ddkS', 'user'),
(36, 'James Compare', 'JamesCompare@gmail', '$2a$10$7/bJH/x8MrtsUMbr5bl8g.Pa9bW3OgmnpGZXVQQcRLG0OCWoSbCxi', 'user'),
(37, 'c', 'c@gmail.com', '$2a$10$P2cIxfkqh0FyX7HWaQEUyOCj0MhFe/xEIpJjUjVwMoFkEFKRZ/qwS', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personality_infomation`
--
ALTER TABLE `personality_infomation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `personality_traits`
--
ALTER TABLE `personality_traits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `personality_infomation`
--
ALTER TABLE `personality_infomation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `personality_traits`
--
ALTER TABLE `personality_traits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `personality_infomation`
--
ALTER TABLE `personality_infomation`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `personality_infomation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `personality_traits`
--
ALTER TABLE `personality_traits`
  ADD CONSTRAINT `personality_traits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
