-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2024 at 04:20 PM
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
-- Table structure for table `attendance_proof`
--

CREATE TABLE `attendance_proof` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `user_id` int(255) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `feedback` varchar(255) NOT NULL,
  `uploaded_by` varchar(100) NOT NULL,
  `attendance_proof` varchar(255) NOT NULL,
  `upload_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'pending',
  `message` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_proof`
--

INSERT INTO `attendance_proof` (`id`, `event_id`, `user_id`, `event_name`, `feedback`, `uploaded_by`, `attendance_proof`, `upload_timestamp`, `status`, `message`) VALUES
(14, 3, 2, 'Appdev Presentation', 'Not happy at all', 'Bryn Pido', 'uploads/Appdev Presentation/BSIT_D_PIDO_BRYNBRYX_SELFIE_1_1.jpg', '2024-06-21 08:42:17', 'Approved', ''),
(15, 4, 5, 'Gordon Heights Gardening', 'it is very fun to garden', 'Einar Lux', 'uploads/Gordon Heights Gardening/Screenshot (6).png', '2024-06-21 08:47:09', 'Pending', ''),
(16, 3, 5, 'Appdev Presentation', 'It was Fine But very much sad', 'Einar Lux', 'uploads/Appdev Presentation/Screenshot 2023-10-03 005145.png', '2024-06-21 16:48:36', 'Approved', '');

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
(3, 'Yes', 'Maybe', 'No', 'Yes', 'Yes', 'it is nice, give away please...:>', '2024-06-16 15:58:53'),
(4, NULL, NULL, NULL, NULL, NULL, NULL, '2024-06-17 15:41:28');

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
  `user_id` int(11) NOT NULL,
  `isArchived` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`participant_id`, `first_name`, `last_name`, `email`, `idnumber`, `user_id`, `isArchived`) VALUES
(1, 'Einar', 'Lux', 'einar@gmail.com', '2022104453', 5, 0),
(2, 'Bryn', 'Pido', '202210445@gordoncollege.edu.ph', '202210445', 2, 0),
(3, 'Rodge Romer', 'Muni', '202210465@gordoncollege.edu.ph', '202210465', 1, 0),
(4, 'Jayvee', 'Apiag', '202210768@gordoncollege.edu.ph', '202210768', 4, 0),
(5, 'John Adrian', 'Fontelera', '202211168@gordoncollege.edu.ph', '202211168', 6, 0);

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
  `idnumber` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrants`
--

INSERT INTO `registrants` (`registration_id`, `user_id`, `event_id`, `participant_id`, `l_name`, `f_name`, `email`, `idnumber`, `gender`) VALUES
(14, 4, 2, 4, 'Apiag', 'Jayvee', '202210768@gordoncollege.edu.ph', '202210768', 'Male'),
(15, 2, 3, 2, 'Pido', 'Bryn', '202210445@gordoncollege.edu.ph', '202210445', 'Male'),
(16, 1, 2, 3, 'Muni', 'Rodge Romer', '202210465@gordoncollege.edu.ph', '202210465', 'Male'),
(17, 6, 4, 5, 'Fontelera', 'John Adrian', '202211168@gordoncollege.edu.ph', '202211168', 'Male'),
(18, 6, 3, 5, 'Fontelera', 'John Adrian', '202211168@gordoncollege.edu.ph', '202211168', 'Male'),
(19, 6, 2, 5, 'Fontelera', 'John Adrian', '202211168@gordoncollege.edu.ph', '202211168', 'Male'),
(20, 2, 4, 2, 'Pido', 'Bryn', '202210445@gordoncollege.edu.ph', '202210445', 'Male');

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
(5, 'Einar', 'Lux', '2022104453', 'einar@gmail.com', '$2y$10$0JU2pQosXLMrfb4VrBVKMOXvFMovpKRqDrIzBT9e2eMAfg/HXYM3C', 'Male'),
(6, 'John Adrian', 'Fontelera', '202211168', '202211168@gordoncollege.edu.ph', '$2y$10$hLAvLDcgVsevBBOFViwdVe4ISDZZX4Ma6H3ALyNUYNMnGgRIHv55W', 'Male');

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
(5, 5, 'BSIT', '09285627664', '2004-11-05', 'Olongapo City', 'male', 'Straight', 'male'),
(6, 4, 'BSIT', '09285627664', '2004-11-05', 'Olongapo City', 'male', 'Straight', 'male'),
(13, 1, 'BSIT', '09291613909', '2004-07-16', 'Olongapo City', 'male', 'Gay', 'transfemale'),
(14, 6, 'BSIT', '09983664065', '2004-08-04', 'Olongapo City', 'male', 'Gay', 'male');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_login`
--
ALTER TABLE `admin_login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_proof`
--
ALTER TABLE `attendance_proof`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `fk_attendance_proof_user_id` (`user_id`);

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
  ADD KEY `participant_id` (`participant_id`),
  ADD KEY `fk_registrants_event_id` (`event_id`);

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
-- AUTO_INCREMENT for table `attendance_proof`
--
ALTER TABLE `attendance_proof`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `registrants`
--
ALTER TABLE `registrants`
  MODIFY `registration_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_proof`
--
ALTER TABLE `attendance_proof`
  ADD CONSTRAINT `attendance_proof_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  ADD CONSTRAINT `fk_attendance_proof_user_id` FOREIGN KEY (`user_id`) REFERENCES `participants` (`user_id`);

--
-- Constraints for table `registrants`
--
ALTER TABLE `registrants`
  ADD CONSTRAINT `fk_registrants_event_id` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
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
