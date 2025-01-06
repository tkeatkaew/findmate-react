-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 05, 2025 at 09:28 AM
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
-- Table structure for table `personalinfomation`
--

CREATE TABLE `personalinfomation` (
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
-- Dumping data for table `personalinfomation`
--

INSERT INTO `personalinfomation` (`id`, `user_id`, `firstname`, `lastname`, `nickname`, `age`, `maritalstatus`, `gender`, `lgbt`) VALUES
(1, 1, 'Teerapat', 'Chomchoey', 'James', 23, 'single', 'male', 0),
(3, 23, 'za', 'za', 'za', 67, 'inrelationship', 'female', 1),
(4, 24, 'hb', 'hb', 'hb', 9, 'married', 'male', 1),
(5, 25, 'nnb', 'nnb', 'nnb', 50, 'single', 'female', 1),
(6, 26, 'jg', 'jg', 'jg', 43, 'single', 'female', 0),
(7, 26, 'jg', 'jg', 'jg', 43, 'single', 'female', 0),
(8, 27, 'df', 'df', 'df', 3, 'single', 'female', 1);

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
(1, 'James', 'tpcc.general@gmail.com', '$2a$10$auqMu6JMnG6iGJaLDmsOpuxvpaWgVlQl6vvDSkCN01Y9VSm9WsZIq', 'user'),
(2, 'admin', 'admin@gmail.com', '$2a$10$QGV9Gg2KNjEbSpdAnWhPi.3wVwQWE43HN.8MwSWAWy9iS5sjturTW', 'admin'),
(7, 'qwe', 'qwe@gmail.com', '$2a$10$hFN0X/YMrHoC5GvDT4aQCeMSnQpYDEqsHom8czBa0OqobbB52/jS2', 'user'),
(8, '1912', '1231@gmail.com', '$2a$10$YScbunTwY3vQ2w37z5vBW.xIY3YLpRAARDDzDU7tO8cX4EmdkgO4C', 'user'),
(9, '121', '121@gmail.com', '$2a$10$TgdF/1Tip.b.cG.xFZEyu.auHoOju0skymiWa.LB/t2hCl2pJpGoC', 'user'),
(10, 'qa', 'qa@gmail.com', '$2a$10$HUOCJGbsAMjkKilJ8dePRel34wjo1q2MzCl6bA61f1SXz/XuG6N9K', 'user'),
(11, 'zx', 'zx@gmail.com', '$2a$10$5AqLRi1dnd1TKBrfsdZJY.LlziDyuXSGWe/O0SZxRcZTQDzv18Z3S', 'user'),
(12, 'cd', 'cd@gmail.com', '$2a$10$/SBS4VX9Bsj8JgED/MGmBuyNGSXoApSTmwz5Rzu.Z1y7YlK7fDG.S', 'user'),
(13, 'bb', 'bb@gmail.com', '$2a$10$/8l8F6h.5GjGw35QFR0aM.bAqGCOZNp.Tb2JoA5t7zG5g1OpW.h8C', 'user'),
(14, 'df', 'df@gmail.com', '$2a$10$dXX7zuZcL8IHivIf7vgtPexj.TQOvmI/16MW5k2QD9pu000xDa5Ey', 'user'),
(15, 'gf', 'gf@gmail.com', '$2a$10$ffgdmFJY5SNqCwJwiTOMxuEk2hQV85nKE7lZ9vqmx18Jbaq5E.jfG', 'user'),
(16, 'bn', 'bn@gmail.com', '$2a$10$/ZOt6nVeTVQtldPXAW4PK.934uAALrVkE1slwITqv8hqSsq/raroS', 'user'),
(17, 'gb', 'gb@gmail.com', '$2a$10$4rPZlyjDhnzRJP5A/rAOJ.9Uda8RY.J1zrR4aPGBSQ28dbuphCKCu', 'user'),
(18, 'vb', 'vb@gmail.com', '$2a$10$aolN0sOjciyKte1ryOOcbe9NM3G4nVhfxGUsfmK4tqJxfNrPH5VOq', 'user'),
(19, 'nn', 'nn@gmail.com', '$2a$10$RiQ1I6i.pAu3DTKdDxa.AuSc/xB0vl2snz8RKbabKCzWB0E97jxOS', 'user'),
(20, 'vv', 'vv@gmail.com', '$2a$10$ft0LoZBW/Kibm7o1kZEWTuxQT46Er9uInEWz0aJEYDbXikhWjamSC', 'user'),
(21, 'mm', 'mm@gmail.com', '$2a$10$9RxAf7rgWbVBFhpMO1fuXeac3.P04znvM5rysNAB5emuVfXiXJVle', 'user'),
(22, 'm', 'm@gmail.com', '$2a$10$o2NE4wdraB4KmGXUugxkJeDeHaNIUNAqFCN2GDpGXhIW9JvF2Eb4u', 'user'),
(23, 'za', 'za@gmail.com', '$2a$10$POGcj/2f5lDsh4i.Ws5SB.UJT/UiZavSh.BqUpil4bE55H9/ClavS', 'user'),
(24, 'hb', 'hb@gmail.com', '$2a$10$l90ngvWj1jvFF1jCN7YcTe5wQRmc9q.FYZgRdLjqCo3EweMFz.B3y', 'user'),
(25, 'nnb', 'nnb@gmail.com', '$2a$10$3Vlft9wG9zbDwmKwjA0Fpea1gK3wWhpwt3RXIF1z52ElbwUjyGTai', 'user'),
(26, 'jg', 'jg@gmail.com', '$2a$10$MiwqYEXPJtJRE.4/v04xP.DBhkyDD2kXWTXkQ4p6hRtbA06530R0y', 'user'),
(27, 'kj', 'kj@gmail.com', '$2a$10$yD2rrpbb/5AG.8PeCsJd4.aXVJBFfOOlZawbrhsfUx8jfBajU5etW', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personalinfomation`
--
ALTER TABLE `personalinfomation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `personalinfomation`
--
ALTER TABLE `personalinfomation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `personalinfomation`
--
ALTER TABLE `personalinfomation`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `personalinfomation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
