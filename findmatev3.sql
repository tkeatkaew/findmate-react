-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 07, 2025 at 01:32 AM
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
-- Database: `findmatev3`
--

-- --------------------------------------------------------

--
-- Table structure for table `personality_infomation`
--

CREATE TABLE `personality_infomation` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `firstname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `age` int NOT NULL,
  `maritalstatus` enum('single','inrelationship','married') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lgbt` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personality_infomation`
--

INSERT INTO `personality_infomation` (`id`, `user_id`, `firstname`, `lastname`, `nickname`, `age`, `maritalstatus`, `gender`, `lgbt`) VALUES
(19, 38, 'Teerapat', 'Chomchoey', 'James', 23, 'single', 'male', 1),
(20, 39, 'a', 'a', 'a', 22, 'single', 'female', 1),
(21, 40, 'b', 'b', 'b', 34, 'inrelationship', 'male', 1),
(22, 41, 'Compare', 'Compare', 'Compare', 23, 'single', 'male', 1),
(23, 42, 'd', 'd', 'd', 23, 'inrelationship', 'female', 0),
(24, 43, 'e', 'e', 'e', 12, 'inrelationship', 'male', 1),
(25, 44, 'f', 'f', 'f', 24, 'inrelationship', 'male', 1),
(26, 45, 'g', 'g', 'g', 45, 'single', 'male', 1),
(27, 46, 'h', 'h', 'h', 45, 'inrelationship', 'female', 1),
(28, 47, 'i', 'i', 'i', 41, 'inrelationship', 'female', 1),
(29, 48, 'j', 'j', 'j', 21, 'inrelationship', 'male', 1),
(30, 49, 'k', 'k', 'k', 35, 'inrelationship', 'female', 0),
(31, 50, 'l', 'l', 'l', 11, 'single', 'male', 0),
(32, 51, 'm', 'm', 'm', 18, 'single', 'male', 0),
(33, 55, 'q', 'q', 'q', 21, 'inrelationship', 'male', 1);

-- --------------------------------------------------------

--
-- Table structure for table `personality_traits`
--

CREATE TABLE `personality_traits` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sleep` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `wake` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clean` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `air_conditioner` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `drink` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `smoke` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `money` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expense` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pet` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cook` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `loud` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `friend` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `religion` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `period` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personality_traits`
--

INSERT INTO `personality_traits` (`id`, `user_id`, `type`, `sleep`, `wake`, `clean`, `air_conditioner`, `drink`, `smoke`, `money`, `expense`, `pet`, `cook`, `loud`, `friend`, `religion`, `period`) VALUES
(1, 38, 'type_introvert', 'sleep_after_midnight', 'wake_noon', 'clean_every_other_day', 'ac_only_hot', 'drink_spacial', 'smoke_never', 'money_on_time', 'money_half', 'pet_dont_have', 'cook_tell_first', 'loud_medium', 'friend_ok', 'religion_no_affect', 'period_no_need'),
(2, 39, 'type_extrovert', 'sleep_after_midnight', 'wake_noon', 'clean_every_day', 'ac_all_day', 'drink_spacial', 'smoke_never', 'money_on_time', 'money_ratio', 'pet_have', 'cook_tell_first', 'loud_low', 'friend_tell_first', 'religion_no', 'period_long'),
(3, 40, 'type_extrovert', 'sleep_before_midnight', 'wake_evening', 'clean_every_day', 'ac_never', 'drink_spacial', 'smoke_spacial', 'money_on_time', 'money_ratio', 'pet_dont_have', 'cook_ok', 'loud_low', 'friend_tell_first', 'religion_no_affect', 'period_long'),
(4, 41, 'type_introvert', 'sleep_after_midnight', 'wake_noon', 'clean_every_other_day', 'ac_only_hot', 'drink_spacial', 'smoke_never', 'money_on_time', 'money_half', 'pet_dont_have', 'cook_tell_first', 'loud_medium', 'friend_ok', 'religion_no_affect', 'period_no_need'),
(5, 42, 'type_extrovert', 'sleep_after_midnight', 'wake_noon', 'clean_once_a_week', 'ac_only_sleep', 'drink_spacial', 'smoke_spacial', 'money_late', 'money_half', 'pet_have', 'cook_no', 'loud_high', 'friend_no', 'religion_no_affect', 'period_sometime'),
(6, 43, 'type_extrovert', 'sleep_before_midnight', 'wake_noon', 'clean_every_other_day', 'ac_only_sleep', 'drink_always', 'smoke_spacial', 'money_late', 'money_ratio', 'pet_have', 'cook_tell_first', 'loud_low', 'friend_no', 'religion_ok', 'period_long'),
(7, 44, 'type_introvert', 'sleep_before_midnight', 'wake_morning', 'clean_every_day', 'ac_never', 'drink_spacial', 'smoke_spacial', 'money_on_time', 'money_half', 'pet_dont_have', 'cook_ok', 'loud_low', 'friend_tell_first', 'religion_no_affect', 'period_sometime'),
(8, 45, 'type_introvert', 'sleep_after_midnight', 'wake_morning', 'clean_every_other_day', 'ac_only_sleep', 'drink_never', 'smoke_never', 'money_late', 'money_half', 'pet_have', 'cook_no', 'loud_medium', 'friend_tell_first', 'religion_ok', 'period_sometime'),
(9, 46, 'type_extrovert', 'sleep_after_midnight', 'wake_noon', 'clean_every_other_day', 'ac_only_hot', 'drink_never', 'smoke_never', 'money_late', 'money_half', 'pet_have', 'cook_tell_first', 'loud_medium', 'friend_no', 'religion_ok', 'period_no_need'),
(10, 47, 'type_ambivert', 'sleep_before_midnight', 'wake_noon', 'clean_every_other_day', 'ac_all_day', 'drink_weekend', 'smoke_spacial', 'money_late', 'money_ratio', 'pet_have', 'cook_tell_first', 'loud_medium', 'friend_tell_first', 'religion_no_affect', 'period_no_need'),
(11, 48, 'type_extrovert', 'sleep_after_midnight', 'wake_evening', 'clean_once_a_week', 'ac_all_day', 'drink_weekend', 'smoke_always', 'money_late', 'money_ratio', 'pet_have', 'cook_no', 'loud_medium', 'friend_no', 'religion_no_affect', 'period_sometime');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `profile_picture` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `profile_picture`) VALUES
(38, 'James', 'tpcc.general@gmail.com', '$2a$10$f404FhS0fV1d09Ob30zqyuRUSTkqXb1D97iWIqzgh4KKn0pkh4rby', 'user', NULL),
(39, 'a', 'a@gmail.com', '$2a$10$mfOSYvY0BbCx3ubjByIpiukQMalY7CF6VqBtMIurBdIcrWTjO9fDi', 'user', NULL),
(40, 'b', 'b@gmail.com', '$2a$10$/CNwGzfV9MOhRAsz/F6T8.wLXhZ3aiY9Y4F5HcZzqUaYdvIrl9DIK', 'user', NULL),
(41, 'Compare', 'compare@gmail.com', '$2a$10$i/qcmyGjAGZrBc35IPC0ueUoLFRyYAZFaCL7zNh/z5BY9p6bibnVy', 'user', NULL),
(42, 'd', 'd@gmail.com', '$2a$10$JEXebQX8K2SLp5iq5SxiounxbT1vIxpTf1RQNmzZ6m6pSqeH61Bba', 'user', '/uploads/1736205148397-James.jpg'),
(43, 'e', 'e@gmail.com', '$2a$10$BZWOOigwfH4OkyAV/Pc64usfNexkUwyxXGPVeMkuxHhBDsfKhB.LW', 'user', NULL),
(44, 'f', 'f@gmail.com', '$2a$10$kamIl0qNjt88zKiVUuM0K..ZqkK6A8csCtbns1MDssW86c1L0ibO6', 'user', NULL),
(45, 'g', 'g@gmail.com', '$2a$10$/5wLfKZ3QJlGJ8NsTRYWnuFm0QT854AegdcXg3iUHUGivlCFpg2.O', 'user', NULL),
(46, 'h', 'h@gmail.com', '$2a$10$uMrV6ZpmUBLUTWtkxLLtfOwhKahe3SMfNDuWk0p/XEYKbt5Wk8jKC', 'user', NULL),
(47, 'i', 'i@gmail.com', '$2a$10$UJZh0fhHxSjR4vAjei5AQel0Ya1E/.gJjm5WafX/uQX8v4ck0iKq.', 'user', NULL),
(48, 'j', 'j@gmail.com', '$2a$10$dZfjpNuu7FmLiudQJ/8W1OZGv5xfzZxxWVbqhg6mosuIjfG8b2FD6', 'user', NULL),
(49, 'k', 'k@gmail.com', '$2a$10$h1MvKFfo1cAElkWi91l/6ewR1C/LBcOjAmX.dNMRPgetg.aM20YZ.', 'user', NULL),
(50, 'l', 'l@gmail.com', '$2a$10$eoOTlQ3m0qSLCWaEBMvJEeDQi2sXWcHA/AOD8vYVtyR6MwuvveDSS', 'user', NULL),
(51, 'm', 'm@gmail.com', '$2a$10$tmNDHoAFzePKWscron.OW.ZTVHY79.RXZUsGmf.x5Ti/QN/ntBN22', 'user', NULL),
(52, 'n', 'n@gmail.com', '$2a$10$abUQHgw/9jsqD9NOVSViNOiu1wwor30VcZF07WcYtihGCtySGGY72', 'user', NULL),
(53, 'o', 'o@gmail.com', '$2a$10$rxIX1.4VHaE3ZmQ4Xkras.pT/fKaPp1zMekUqVLM/ETTYjfViIQZy', 'user', NULL),
(54, 'p', 'p@gmail.com', '$2a$10$ubExftsZRGAPxU6m.xva4.zCCXtpbFHtzrOTVJN4TvC5id064XG0y', 'user', NULL),
(55, 'q', 'q@gmail.com', '$2a$10$275Ra0PU9XF8L82eQ9CXcuU/fEksw6M3V79pNAIziz4jQjh2DlR/e', 'user', '/uploads/1736211272322-James.jpg');

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `personality_traits`
--
ALTER TABLE `personality_traits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

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
  ADD CONSTRAINT `personality_traits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
