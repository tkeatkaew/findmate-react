-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Feb 01, 2025 at 07:02 AM
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
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `liked_user_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `liked_user_id`, `created_at`) VALUES
(15, 41, 38, '2025-01-07 11:38:41'),
(48, 38, 45, '2025-01-07 17:01:41'),
(53, 65, 43, '2025-01-08 01:55:21'),
(54, 65, 38, '2025-01-08 01:55:31'),
(59, 38, 56, '2025-01-08 13:40:58'),
(68, 61, 38, '2025-01-08 15:43:30'),
(72, 56, 38, '2025-01-08 23:37:54'),
(73, 56, 65, '2025-01-08 23:38:01'),
(74, 56, 41, '2025-01-08 23:54:05'),
(76, 67, 38, '2025-01-09 08:20:26'),
(79, 40, 61, '2025-01-11 07:10:47'),
(80, 44, 40, '2025-01-19 15:11:57'),
(81, 38, 41, '2025-01-29 07:25:23'),
(82, 38, 62, '2025-01-29 08:07:48'),
(83, 38, 58, '2025-01-29 08:28:25'),
(84, 38, 46, '2025-01-29 08:44:57'),
(85, 69, 38, '2025-01-29 10:40:11'),
(86, 81, 62, '2025-01-30 10:37:12'),
(87, 82, 81, '2025-01-30 11:48:06');

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `id` int NOT NULL,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`id`, `user1_id`, `user2_id`, `created_at`) VALUES
(43, 56, 38, '2025-01-08 23:37:54'),
(47, 38, 41, '2025-01-29 07:25:23');

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
  `lgbt` int NOT NULL,
  `province` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `university` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `facebook` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `line_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dorm_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '"ไม่มี"',
  `vehicle` enum('none','motorbike','car','other') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `self_introduction` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personality_infomation`
--

INSERT INTO `personality_infomation` (`id`, `user_id`, `firstname`, `lastname`, `nickname`, `age`, `maritalstatus`, `gender`, `lgbt`, `province`, `university`, `facebook`, `instagram`, `line_id`, `phone`, `dorm_name`, `vehicle`, `self_introduction`) VALUES
(19, 38, 'Teerapat', 'Chomchoey', 'James', 23, 'single', 'male', 0, 'กรุงเทพมหานคร', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 'Teerapat Chomchoey', 'jschomchoey', 'jschomchoey', '0616989385', 'CK Apartment', 'motorbike', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer suscipit in sem in commodo. Sed laoreet elementum mi eu posuere. Proin eu eros vel metus tempor venenatis eu vitae mi. Quisque ultrices efficitur felis, sit amet tristique dui rutrum non. Nulla convallis massa vitae neque dapibus ultrices. Nunc at ipsum pretium, volutpat felis a, convallis elit. Curabitur in ipsum vitae tortor consequat fringilla at malesuada nunc. Ut quis est non ligula semper varius sed ut nisl. Cras id sapien mi. Curabitur vitae efficitur ex. Duis nisl sem, auctor et erat vitae, lobortis mollis massa.'),
(20, 39, 'a', 'a', 'a', 22, 'single', 'female', 1, 'กรุงเทพมหานคร', 'จุฬาลงกรณ์มหาวิทยาลัย', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(21, 40, 'b', 'b', 'b', 34, 'inrelationship', 'male', 1, 'กรุงเทพมหานคร', 'มหาวิทยาลัยศิลปากร', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(22, 41, 'Compare', 'Compare', 'Compare', 23, 'single', 'male', 0, 'เชียงใหม่', 'มหาวิทยาลัยเชียงใหม่', 'Teerapat Chomchoey', 'jschomchoey', 'jschomchoey', '0616989385', 'CK Apartment', 'motorbike', 'เจมส์'),
(23, 42, 'd', 'd', 'd', 23, 'inrelationship', 'female', 0, 'ขอนแก่น', 'มหาวิทยาลัยขอนแก่น', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(24, 43, 'e', 'e', 'e', 12, 'inrelationship', 'male', 1, 'กรุงเทพมหานคร', 'มหาวิทยาลัยมหิดล', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(25, 44, 'f', 'f', 'f', 24, 'inrelationship', 'male', 1, 'ขอนแก่น', 'มหาวิทยาลัยราชภัฏขอนแก่น', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(26, 45, 'g', 'g', 'g', 45, 'single', 'male', 1, 'กรุงเทพมหานคร', 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(27, 46, 'h', 'h', 'h', 45, 'inrelationship', 'female', 1, 'กรุงเทพมหานคร', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(28, 47, 'i', 'i', 'i', 41, 'inrelationship', 'female', 1, 'กรุงเทพมหานคร', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(34, 56, 'j', 'j', 'j', 23, 'single', 'female', 0, 'เชียงใหม่', 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา วิทยาเขตภาคพายัพจังหวัดเชียงใหม่', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(35, 57, 'k', 'k', 'k', 24, 'inrelationship', 'male', 1, 'เชียงใหม่', 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา วิทยาเขตดอยสะเก็ด', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(36, 58, 'l', 'l', 'l', 21, 'single', 'male', 0, 'ชุมพร', 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง วิทยาเขตชุมพรเขตอุดมศักดิ์', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(37, 59, 'm', 'm', 'm', 44, 'single', 'female', 1, 'เชียงใหม่', 'มหาวิทยาลัยนอร์ท-เชียงใหม่', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(38, 60, 'n', 'n', 'n', 32, 'single', 'male', 0, 'ตราด', 'วิทยาลัยชุมชนตราด', NULL, NULL, NULL, NULL, NULL, 'none', NULL),
(39, 61, 'o', 'o', 'o', 57, 'single', 'male', 0, 'กรุงเทพมหานคร', 'มหาวิทยาลัยการกีฬาแห่งชาติ วิทยาเขตกรุงเทพ', 'o', 'o', 'o', 'o', NULL, 'car', NULL),
(40, 62, 'p', 'p', 'p', 32, 'single', 'male', 1, 'เชียงใหม่', 'มหาวิทยาลัยแม่โจ้', 'p', 'p', 'p', 'p', 'p', 'car', 'p'),
(41, 63, 'q', 'q', 'q', 21, 'inrelationship', 'male', 1, 'ตราด', 'วิทยาลัยชุมชนตราด', 'q', 'q', '', '', '', 'motorbike', 'q'),
(42, 65, 'r', 'r', 'r', 24, 'single', 'female', 1, 'กรุงเทพมหานคร', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 'r', 'r', '', 'r', '', 'motorbike', 'rrr'),
(43, 66, 'Amin', 'Admin', 'Admin', 23, 'inrelationship', 'male', 1, 'ขอนแก่น', 'มหาวิทยาลัยขอนแก่น', 'sdsd', '', '', '', 'sd', 'motorbike', 'sdfad.fnagsldgn;jadfgadfdfvjba\'fv'),
(44, 67, 'ภีมวัจน์', 'ทรายตา', 'ภู', 23, 'single', 'male', 0, 'เชียงใหม่', 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา วิทยาเขตภาคพายัพจังหวัดเชียงใหม่', 'ภีมวัจน์ ทรายตา', '_thephuuu', 'phu1105', '0931713860', '', 'motorbike', 'ขาว หมวย สวย อึ๋ม'),
(45, 68, 'qa', 'qa', 'qa', 32, 'single', 'female', 1, 'เชียงใหม่', 'มหาวิทยาลัยมหามกุฏราชวิทยาลัย วิทยาเขตล้านนา', 'wqe', 'qwe', 'qew', '', '', 'motorbike', 'weqweqwe'),
(46, 69, 'ben', 'ramajub', 'ben', 20, 'married', 'female', 1, 'เชียงใหม่', 'มหาวิทยาลัยเชียงใหม่', 'benrama', 'benrama', 'benrama', '0811111111', 'banben', 'other', ''),
(51, 81, 'fasai', 'phiasaen', 'sea', 25, 'single', 'female', 1, 'เชียงใหม่', 'มหาวิทยาลัยเชียงใหม่', '', '__ssseaaa__', '', '', '', 'motorbike', ''),
(52, 82, 'parichat', 'mahamai', 'baitoey', 24, 'single', 'female', 0, 'เชียงใหม่', 'มหาวิทยาลัยเชียงใหม่', '', '', '', '0989182433', '', 'motorbike', '');

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
(12, 56, 'type_extrovert', 'sleep_before_midnight', 'wake_noon', 'clean_once_a_week', 'ac_only_sleep', 'drink_weekend', 'smoke_never', 'money_on_time', 'money_ratio', 'pet_have', 'cook_tell_first', 'loud_high', 'friend_ok', 'religion_no_affect', 'period_no_need'),
(13, 57, 'type_extrovert', 'sleep_before_midnight', 'wake_morning', 'clean_dont_really', 'ac_never', 'drink_always', 'smoke_always', 'money_late', 'money_ratio', 'pet_have', 'cook_no', 'loud_high', 'friend_no', 'religion_no', 'period_long'),
(14, 58, 'type_introvert', 'sleep_before_midnight', 'wake_evening', 'clean_every_other_day', 'ac_only_hot', 'drink_weekend', 'smoke_spacial', 'money_on_time', 'money_half', 'pet_dont_have', 'cook_no', 'loud_high', 'friend_no', 'religion_no_affect', 'period_long'),
(15, 59, 'type_extrovert', 'sleep_before_midnight', 'wake_noon', 'clean_once_a_week', 'ac_only_hot', 'drink_weekend', 'smoke_spacial', 'money_late', 'money_half', 'pet_have', 'cook_ok', 'loud_low', 'friend_ok', 'religion_no_affect', 'period_long'),
(16, 60, 'type_ambivert', 'sleep_before_midnight', 'wake_morning', 'clean_every_day', 'ac_only_sleep', 'drink_spacial', 'smoke_spacial', 'money_late', 'money_ratio', 'pet_have', 'cook_ok', 'loud_medium', 'friend_tell_first', 'religion_ok', 'period_sometime'),
(17, 61, 'type_extrovert', 'sleep_before_midnight', 'wake_evening', 'clean_every_day', 'ac_only_sleep', 'drink_always', 'smoke_always', 'money_late', 'money_half', 'pet_have', 'cook_ok', 'loud_low', 'friend_tell_first', 'religion_no_affect', 'period_sometime'),
(18, 62, 'type_introvert', 'sleep_after_midnight', 'wake_evening', 'clean_once_a_week', 'ac_only_hot', 'drink_spacial', 'smoke_never', 'money_on_time', 'money_ratio', 'pet_dont_have', 'cook_tell_first', 'loud_medium', 'friend_tell_first', 'religion_no_affect', 'period_sometime'),
(19, 63, 'type_ambivert', 'sleep_before_midnight', 'wake_noon', 'clean_every_day', 'ac_only_sleep', 'drink_spacial', 'smoke_always', 'money_late', 'money_half', 'pet_have', 'cook_no', 'loud_medium', 'friend_no', 'religion_ok', 'period_sometime'),
(20, 65, 'type_extrovert', 'sleep_before_midnight', 'wake_noon', 'clean_every_other_day', 'ac_only_sleep', 'drink_weekend', 'smoke_spacial', 'money_late', 'money_ratio', 'pet_have', 'cook_tell_first', 'loud_medium', 'friend_tell_first', 'religion_ok', 'period_sometime'),
(21, 66, 'type_extrovert', 'sleep_before_midnight', 'wake_evening', 'clean_once_a_week', 'ac_only_hot', 'drink_always', 'smoke_spacial', 'money_late', 'money_half', 'pet_have', 'cook_tell_first', 'loud_high', 'friend_tell_first', 'religion_no_affect', 'period_sometime'),
(22, 67, 'type_ambivert', 'sleep_after_midnight', 'wake_noon', 'clean_once_a_week', 'ac_only_hot', 'drink_always', 'smoke_spacial', 'money_late', 'money_half', 'pet_have', 'cook_tell_first', 'loud_high', 'friend_tell_first', 'religion_no_affect', 'period_sometime'),
(23, 68, 'type_introvert', 'sleep_before_midnight', 'wake_morning', 'clean_every_other_day', 'ac_only_hot', 'drink_weekend', 'smoke_spacial', 'money_late', 'money_half', 'pet_dont_have', 'cook_tell_first', 'loud_high', 'friend_tell_first', 'religion_no_affect', 'period_sometime'),
(24, 69, 'type_introvert', 'sleep_before_midnight', 'wake_noon', 'clean_every_day', 'ac_only_hot', 'drink_spacial', 'smoke_never', 'money_on_time', 'money_half', 'pet_have', 'cook_ok', 'loud_medium', 'friend_ok', 'religion_no_affect', 'period_long'),
(29, 81, 'type_ambivert', 'sleep_after_midnight', 'wake_morning', 'clean_dont_really', 'ac_all_day', 'drink_spacial', 'smoke_never', 'money_on_time', 'money_half', 'pet_dont_have', 'cook_tell_first', 'loud_medium', 'friend_tell_first', 'religion_no_affect', 'period_sometime'),
(30, 82, 'type_introvert', 'sleep_after_midnight', 'wake_noon', NULL, 'ac_only_hot', 'drink_spacial', 'smoke_never', 'money_late', 'money_ratio', 'pet_dont_have', 'cook_no', 'loud_medium', 'friend_tell_first', 'religion_no_affect', 'period_sometime');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int NOT NULL,
  `reporter_id` int NOT NULL,
  `reported_user_id` int DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `report_type` enum('user','system') COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('pending','resolved','rejected') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `reporter_id`, `reported_user_id`, `type`, `description`, `image`, `report_type`, `status`, `created_at`) VALUES
(1, 38, 41, 'harassment', 'dsfsdfsdfsd', NULL, 'user', 'rejected', '2025-01-11 16:52:11'),
(3, 38, 39, 'inappropriate', 'ทดสอบการรายงาน', NULL, 'user', 'rejected', '2025-01-11 21:00:38'),
(4, 38, NULL, 'ui', 'ทดสอบ', '/uploads/1736634005301-437565052_2357716371092617_9163711070272391592_n.jpg', 'system', 'pending', '2025-01-11 22:20:05'),
(5, 38, NULL, 'performance', 'กกก', NULL, 'system', 'pending', '2025-01-13 08:36:37'),
(6, 38, 46, 'fake_profile', '', NULL, 'user', 'pending', '2025-01-29 08:45:04');

-- --------------------------------------------------------

--
-- Table structure for table `suggestions`
--

CREATE TABLE `suggestions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('pending','reviewed','implemented','rejected') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suggestions`
--

INSERT INTO `suggestions` (`id`, `user_id`, `content`, `status`, `created_at`) VALUES
(1, 38, 'ทดสอบ', 'pending', '2025-01-11 22:20:35'),
(2, 38, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non felis non velit feugiat lacinia. Nulla mattis at ligula in hendrerit. Morbi non velit id odio scelerisque porttitor id a sapien. Pellentesque enim tortor, faucibus non augue sit amet, porttitor congue ipsum. Pellentesque massa tortor, pharetra vel justo placerat, consequat tristique ligula. Etiam sed eros placerat, finibus erat vitae, lobortis quam. Vestibulum risus enim, vestibulum lobortis nulla a, mattis tincidunt velit. Curabitur ut pharetra enim. Donec orci ante, blandit in ante nec, aliquam dignissim eros.\n\n', 'pending', '2025-01-11 22:21:16');

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
  `profile_picture` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_suspended` tinyint(1) DEFAULT '0',
  `suspension_reason` text COLLATE utf8mb4_general_ci,
  `email_verified` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `profile_picture`, `is_suspended`, `suspension_reason`, `email_verified`) VALUES
(38, 'James', 'tpcc.general@gmail.com', '$2a$10$f404FhS0fV1d09Ob30zqyuRUSTkqXb1D97iWIqzgh4KKn0pkh4rby', 'user', '/uploads/1736578954063-80240ED7-623F-4412-9444-0C8E6CC77024.jpg', 0, NULL, 0),
(39, 'a', 'a@gmail.com', '$2a$10$mfOSYvY0BbCx3ubjByIpiukQMalY7CF6VqBtMIurBdIcrWTjO9fDi', 'user', '/uploads/1736579299922-A1FF3A52-7E43-496B-AF81-8FBE5D360E28.jpg', 0, NULL, 0),
(40, 'b', 'b@gmail.com', '$2a$10$/CNwGzfV9MOhRAsz/F6T8.wLXhZ3aiY9Y4F5HcZzqUaYdvIrl9DIK', 'user', '/uploads/1736579421507-97D6642D-FAC5-455A-9B6B-71B245DB5E93.jpg', 0, NULL, 0),
(41, 'Compare', 'compare@gmail.com', '$2a$10$i/qcmyGjAGZrBc35IPC0ueUoLFRyYAZFaCL7zNh/z5BY9p6bibnVy', 'user', NULL, 0, NULL, 0),
(42, 'd', 'd@gmail.com', '$2a$10$JEXebQX8K2SLp5iq5SxiounxbT1vIxpTf1RQNmzZ6m6pSqeH61Bba', 'user', '/uploads/1736205148397-James.jpg', 0, NULL, 0),
(43, 'e', 'e@gmail.com', '$2a$10$BZWOOigwfH4OkyAV/Pc64usfNexkUwyxXGPVeMkuxHhBDsfKhB.LW', 'user', NULL, 0, NULL, 0),
(44, 'f', 'f@gmail.com', '$2a$10$kamIl0qNjt88zKiVUuM0K..ZqkK6A8csCtbns1MDssW86c1L0ibO6', 'user', NULL, 0, NULL, 0),
(45, 'g', 'g@gmail.com', '$2a$10$/5wLfKZ3QJlGJ8NsTRYWnuFm0QT854AegdcXg3iUHUGivlCFpg2.O', 'user', '/uploads/1736606961868-407671912_3114387742029699_3195186485123866947_n.jpg', 1, 'บัญชีปลอม', 0),
(46, 'h', 'h@gmail.com', '$2a$10$uMrV6ZpmUBLUTWtkxLLtfOwhKahe3SMfNDuWk0p/XEYKbt5Wk8jKC', 'user', '/uploads/1736607003681-411071610_6340072182759245_3500830113698890089_n.jpg', 0, NULL, 0),
(47, 'i', 'i@gmail.com', '$2a$10$qVAqdcw5/48OQyPFmevqd.pSNxceA6pkkIS82.qP89o.4xEAZmBGW', 'user', NULL, 0, NULL, 0),
(56, 'j', 'j@gmail.com', '$2a$10$JiKngO4lCe5DYNck2IB5Wu5f.ZrRqY3nSgkmI6PCfRF5q99G0IGVO', 'user', NULL, 0, NULL, 0),
(57, 'k', 'k@gmail.com', '$2a$10$ApcgMYNPJzAhaAJFjQjmVuR5f6nsFrIIzwiawbXoXy4ZQQfHWXNWO', 'user', NULL, 0, NULL, 0),
(58, 'l', 'l@gmail.com', '$2a$10$w0tC.VObSEE/MNJl7Wdz/OoDeungREI20cY6ou8tVyvIvKFLumhVC', 'user', NULL, 0, NULL, 0),
(59, 'm', 'm@gmail.com', '$2a$10$C6DxEgTi3ZwifwbPZbSQ1..DcYHoYrJOXtJ9AWgbLsHCZPQexgkFa', 'user', '/uploads/1736289616086-James.jpg', 0, NULL, 0),
(60, 'n', 'n@gmail.com', '$2a$10$bRfvOaZH03kT4HktI9oFmeTRh12FxczH1hhJsIwePCRr7ozdT82nq', 'user', '/uploads/1736289790478-James.jpg', 0, NULL, 0),
(61, 'o', 'o@gmail.com', '$2a$10$W0NDzClq6unFu3EhUpyG4uc6TWKiglPOPdngrboBiOG.YSm9wPCR2', 'user', '/uploads/1736290635967-James.jpg', 0, NULL, 0),
(62, 'p', 'p@gmail.com', '$2a$10$tS7P.hfU5GqdfI9612fp6OAO5kWslKSuTuFSww3w74kImiDg938C2', 'user', '/uploads/1736298257898-James.jpg', 0, NULL, 0),
(63, 'q', 'q@gmail.com', '$2a$10$/zzKMwrE2vE6xvGcXO85cuRRO00KpdyYJYed1L2HOoLUnI3ANrVR2', 'user', NULL, 0, NULL, 0),
(65, 'r', 'r@gmail.com', '$2a$10$ilHYfBuNv3JTdH.WIC7U0eKvrGz7tKtS1lGZEwR.Uk/zOyppgRfGa', 'user', '/uploads/1736301277697-James.jpg', 0, NULL, 0),
(66, 'admin', 'admin@gmail.com', '$2a$10$cbwNvl0TLoknskbG8HwajuWmQ/e82X0.wZ.Ou36UVjgERFBAhdk.a', 'admin', '/uploads/1736407465155-James.jpg', 0, NULL, 0),
(67, 'thephuuu', 'phuma1105@gmail.com', '$2a$10$SMbE4HNVVqpEHYc3m8voE.ypt6GwEWnjx9dLtyoZB7hUnHFB5kq76', 'user', '/uploads/1736606866838-437565052_2357716371092617_9163711070272391592_n.jpg', 0, NULL, 0),
(68, 'qw', 'qw@gmail.com', '$2a$10$B9o1GUWSRIVGrtcwTMC/c.G0U/S0FbEFVmhyN5f4v8KIpiSyz3BP.', 'user', NULL, 0, NULL, 0),
(69, 'benramajub', 'benrama@gmail.com', '$2a$10$HxPZz.uWd9H0Il1uY7C/G.TD6cjymizCcxgw818yJybb5zI5ez50e', 'user', NULL, 0, NULL, 0),
(81, 'seatuan', 'shsy.svy@gmail.com', '$2a$10$lxKgnt1f0Y8j1HpI6aBdxeJ8cQv82hxAbbuT6UcG3pjlRqBxS1Lkm', 'user', NULL, 0, NULL, 1),
(82, 'baitoey', 'parichat.tey@gmail.com', '$2a$10$gIDheaYKG8hLccZj3tpkWueEKL9JaSs3iYJWKNkSpGYuqEUgITaf.', 'user', NULL, 0, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`liked_user_id`),
  ADD KEY `liked_user_id` (`liked_user_id`);

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_match` (`user1_id`,`user2_id`),
  ADD KEY `user2_id` (`user2_id`);

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
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `reported_user_id` (`reported_user_id`);

--
-- Indexes for table `suggestions`
--
ALTER TABLE `suggestions`
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
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `personality_infomation`
--
ALTER TABLE `personality_infomation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `personality_traits`
--
ALTER TABLE `personality_traits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `suggestions`
--
ALTER TABLE `suggestions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`liked_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

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

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD CONSTRAINT `suggestions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
