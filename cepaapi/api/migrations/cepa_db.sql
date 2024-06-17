-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2024 at 10:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cepa_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_login`
--

CREATE TABLE `admin_login` (
  `id` int(11) NOT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_login`
--

INSERT INTO `admin_login` (`id`, `password`) VALUES
(202210014, 'sanjose'),
(202210293, 'valdez'),
(202210388, 'diza'),
(202210445, 'pido'),
(202210768, 'apiag'),
(202211168, 'fontelera'),
(202211183, 'gabat'),
(202211456, 'nedruda'),
(202211536, 'payawal'),
(2022104656, 'muni');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `event_location` varchar(255) NOT NULL,
  `organizer` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `event_name`, `event_date`, `event_location`, `organizer`, `description`, `archived`) VALUES
(1, 'GC World Teacher\'s Day', '2024-10-05', 'Gordon College', 'Gordon College', 'GC World Teacher\'s Day Celebration', 1),
(2, 'GC Annual Sportfest', '2024-11-26', 'Gordon College', 'Gordon College', 'GC Annual Sportfest', 0),
(3, 'Appdev Presentation', '2024-05-29', 'Gordon College Function Hall', 'CEPA', 'Presentation for Appdev Project', 0),
(4, 'Gordon Heights Gardening', '2024-06-08', 'Gordon Heights', 'Gordon Heights Barangay', 'Gardening', 0);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `q1_answer` varchar(10) DEFAULT NULL,
  `q2_answer` varchar(10) DEFAULT NULL,
  `q3_answer` varchar(10) DEFAULT NULL,
  `q4_answer` varchar(10) DEFAULT NULL,
  `q5_answer` varchar(10) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `q1_answer`, `q2_answer`, `q3_answer`, `q4_answer`, `q5_answer`, `feedback`, `created_at`) VALUES
(1, 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'i want to see more ', '2024-05-29 07:16:00'),
(2, 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'So good', '2024-05-30 01:27:57'),
(3, 'Yes', 'Maybe', 'No', 'Yes', 'Yes', 'it is nice, give away please...:>', '2024-06-16 15:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `participant_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `idnumber` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`participant_id`, `first_name`, `last_name`, `email`, `idnumber`, `user_id`) VALUES
(1, 'Einar', 'Lux', 'einar@gmail.com', '2022104453', 5),
(2, 'Bryn', 'Pido', '202210445@gordoncollege.edu.ph', '202210445', 2);

-- --------------------------------------------------------

--
-- Table structure for table `registrants`
--

CREATE TABLE `registrants` (
  `registration_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `participant_id` int(11) NOT NULL,
  `l_name` varchar(255) NOT NULL,
  `f_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `idnumber` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrants`
--

INSERT INTO `registrants` (`registration_id`, `user_id`, `event_id`, `participant_id`, `l_name`, `f_name`, `email`, `idnumber`) VALUES
(1, 5, 2, 1, 'Lux', 'Einar', 'einar@gmail.com', '2022104453'),
(2, 5, 3, 1, 'Lux', 'Einar', 'einar@gmail.com', '2022104453'),
(3, 2, 2, 2, 'Pido', 'Bryn', '202210445@gordoncollege.edu.ph', '202210445'),
(4, 2, 3, 2, 'Pido', 'Bryn', '202210445@gordoncollege.edu.ph', '202210445'),
(5, 2, 4, 2, 'Pido', 'Bryn', '202210445@gordoncollege.edu.ph', '202210445'),
(8, 5, 4, 1, 'Lux', 'Einar', 'einar@gmail.com', '2022104453');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `idnumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `idnumber`, `email`, `password`, `gender`) VALUES
(1, 'Rodge Romer', 'Muni', '202210465', '202210465@gordoncollege.edu.ph', '$2y$10$tEA2ao2GLtbMVicgn25Mo.kr40uZhp34EDqtyQPtafOmjCUuRbpzi', 'Male'),
(2, 'Bryn', 'Pido', '202210445', '202210445@gordoncollege.edu.ph', '$2y$10$2AwGZmAbBjF/xoV6D9gUu.ob07IVvqRm2NKihd8pFR5SfZds.tD42', 'Male'),
(3, 'Giovanni', 'Gabat', '202211183', '202211183@gordoncollege.edu.ph', '$2y$10$8ebTJC2VvFpOaatKZeZZY.Co3igWZnRU2G5pyvmlK7LuN0.wDkvK2', 'Male'),
(4, 'Jayvee', 'Apiag', '202210768', '202210768@gordoncollege.edu.ph', '$2y$10$/mf33RSTHtqQ6B0/wOurYexaNzwCUMzMqlGauIagjqp8qu0KzV92u', 'Male'),
(5, 'Einar', 'Lux', '2022104453', 'einar@gmail.com', '$2y$10$0JU2pQosXLMrfb4VrBVKMOXvFMovpKRqDrIzBT9e2eMAfg/HXYM3C', 'Male');

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `college_program` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `sexual_orientation` varchar(255) DEFAULT NULL,
  `gender_identity` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`id`, `user_id`, `college_program`, `phone_number`, `date_of_birth`, `place_of_birth`, `gender`, `sexual_orientation`, `gender_identity`) VALUES
(4, 2, 'BSIT', '09285627664', '2004-11-05', 'Olongapo City', 'male', 'Straight', 'male'),
(5, 5, 'BSIT', '09285627664', '2004-11-05', 'Olongapo City', 'male', 'Straight', 'male');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_login`
--
ALTER TABLE `admin_login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `registrants`
--
ALTER TABLE `registrants`
  ADD PRIMARY KEY (`registration_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `participant_id` (`participant_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `registrants`
--
ALTER TABLE `registrants`
  MODIFY `registration_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `registrants`
--
ALTER TABLE `registrants`
  ADD CONSTRAINT `registrants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `participants` (`user_id`),
  ADD CONSTRAINT `registrants_ibfk_2` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`participant_id`);

--
-- Constraints for table `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
