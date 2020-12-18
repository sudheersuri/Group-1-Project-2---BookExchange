-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2020 at 07:32 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookexchangedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `exchangerequests`
--

CREATE TABLE `exchangerequests` (
  `eid` bigint(20) NOT NULL,
  `requestorid` bigint(20) DEFAULT NULL,
  `requesteeid` bigint(20) DEFAULT NULL,
  `requestorbookid` bigint(20) DEFAULT NULL,
  `requesteebookid` bigint(20) DEFAULT NULL,
  `requestorgenreid` bigint(20) DEFAULT NULL,
  `requesteegenreid` bigint(20) DEFAULT NULL,
  `requesteddate` varchar(20) DEFAULT NULL,
  `transactionstatus` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `genrerating`
--

CREATE TABLE `genrerating` (
  `id` bigint(20) NOT NULL,
  `genreid` bigint(20) DEFAULT NULL,
  `uid` bigint(20) DEFAULT NULL,
  `rating` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `genrerating`
--

INSERT INTO `genrerating` (`id`, `genreid`, `uid`, `rating`) VALUES
(1, 1, 20, '3'),
(2, 1, 21, '4'),
(3, 2, 22, '3'),
(4, 1, 22, '3'),
(5, 2, 20, '4'),
(6, 3, 22, '4'),
(7, 4, 22, '5'),
(8, 1, 20, '3');

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `genreid` bigint(20) NOT NULL,
  `genredesc` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`genreid`, `genredesc`) VALUES
(1, 'Mystery'),
(2, 'Horror'),
(3, 'Thriller'),
(4, 'Sci-fi');

-- --------------------------------------------------------

--
-- Table structure for table `loginhistory`
--

CREATE TABLE `loginhistory` (
  `id` bigint(20) NOT NULL,
  `uid` bigint(20) DEFAULT NULL,
  `lastlogindate` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `loginhistory`
--

INSERT INTO `loginhistory` (`id`, `uid`, `lastlogindate`) VALUES
(80, 20, '2020-12-06T22:14:36.'),
(81, 20, '2020-12-06T22:16:24.'),
(82, 20, '2020-12-07T00:22:24.'),
(83, 20, '2020-12-08T21:52:05.'),
(84, 20, '2020-12-08T21:56:34.'),
(85, 20, '2020-12-08T21:59:01.'),
(86, 20, '2020-12-08T22:03:44.'),
(87, 20, '2020-12-08T22:04:38.'),
(88, 20, '2020-12-08T22:05:39.'),
(89, 20, '2020-12-08T22:06:27.'),
(90, 20, '2020-12-08T22:06:43.'),
(91, 20, '2020-12-08T22:07:56.'),
(92, 20, '2020-12-09T14:08:45.'),
(93, 20, '2020-12-09T14:10:18.'),
(94, 20, '2020-12-09T14:16:23.'),
(95, 20, '2020-12-09T14:24:50.'),
(96, 20, '2020-12-09T14:51:08.'),
(97, 20, '2020-12-09T14:52:18.'),
(98, 21, '2020-12-09T15:24:30.'),
(99, 21, '2020-12-09T15:29:09.'),
(100, 22, '2020-12-13T15:11:03.'),
(101, 22, '2020-12-13T15:42:19.'),
(102, 22, '2020-12-13T15:47:19.'),
(103, 22, '2020-12-13T15:47:37.'),
(104, 20, '2020-12-14T00:29:44.');

-- --------------------------------------------------------

--
-- Table structure for table `userbooks`
--

CREATE TABLE `userbooks` (
  `id` bigint(20) NOT NULL,
  `uid` bigint(20) NOT NULL,
  `bookid` bigint(20) NOT NULL,
  `bookname` varchar(20) DEFAULT NULL,
  `bookdesc` varchar(100) DEFAULT NULL,
  `bookimgurlone` varchar(200) DEFAULT NULL,
  `bookimgurltwo` varchar(200) DEFAULT NULL,
  `genreid` bigint(20) DEFAULT NULL,
  `bookposteddate` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userbooks`
--

INSERT INTO `userbooks` (`id`, `uid`, `bookid`, `bookname`, `bookdesc`, `bookimgurlone`, `bookimgurltwo`, `genreid`, `bookposteddate`) VALUES
(16, 22, 221607872276419, '3 mistakes of my lif', 'Good book , must read', 'http://localhost:3000/public/images/myfile-1607872276410.jpg', NULL, 1, '2020-12-13 15:11:16.418Z'),
(17, 22, 221607872460538, 'Wings of fire', 'Very hot book', 'http://localhost:3000/public/images/myfile-1607872460522.jpg', NULL, 4, '2020-12-13 15:14:20.537Z'),
(18, 22, 221607872918931, 'Sherlock Holmes', 'A full fledged Mystery to decode.', 'http://localhost:3000/public/images/myfile-1607872918928.jpg', NULL, 1, '2020-12-13 15:21:58.930Z'),
(19, 22, 221607873056929, 'Da Vinci the secret ', 'Mystery Thriller to be read.', 'http://localhost:3000/public/images/myfile-1607873056925.jpg', NULL, 1, '2020-12-13 15:24:16.928Z'),
(20, 22, 221607873195929, 'Star Wars Death Troo', 'Scifi horror amazing experience while reading.', 'http://localhost:3000/public/images/myfile-1607873195925.jpg', NULL, 2, '2020-12-13 15:26:35.928Z'),
(21, 22, 221607874585666, 'The Ritual', 'The horror forest experience.', 'http://localhost:3000/public/images/myfile-1607874585662.jpg', NULL, 2, '2020-12-13 15:49:45.666Z'),
(22, 22, 221607874735089, 'Black', 'The dark fictious story', 'http://localhost:3000/public/images/myfile-1607874735087.jpg', NULL, 2, '2020-12-13 15:52:15.089Z'),
(23, 22, 221607874854246, 'The Storm', 'An Action Thriller Book to read.', 'http://localhost:3000/public/images/myfile-1607874854179.jpg', NULL, 3, '2020-12-13 15:54:14.245Z'),
(24, 22, 221607874863784, '', '', 'http://localhost:3000/public/images/myfile-1607874863781.jpg', NULL, 1, '2020-12-13 15:54:23.783Z'),
(25, 22, 221607875051598, 'The 7th Victim', 'This is a Thriller mystery combination book.', 'http://localhost:3000/public/images/myfile-1607875051591.jpg', NULL, 3, '2020-12-13 15:57:31.597Z'),
(26, 22, 221607875210818, 'The Girl on the Trai', 'A book with a new twist of Thrill.', 'http://localhost:3000/public/images/myfile-1607875210816.jpg', NULL, 3, '2020-12-13 16:00:10.818Z'),
(27, 22, 221607875310600, 'Space Force', 'This is a Space action based movie plus adventure', 'http://localhost:3000/public/images/myfile-1607875310590.jpg', NULL, 4, '2020-12-13 16:01:50.600Z'),
(28, 22, 221607875396975, 'The Oblivion', 'This is a outer space + fiction novel ', 'http://localhost:3000/public/images/myfile-1607875396970.jpg', NULL, 4, '2020-12-13 16:03:16.975Z');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` bigint(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(35) NOT NULL,
  `password` varchar(10) NOT NULL,
  `previouslogin` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `username`, `email`, `password`, `previouslogin`) VALUES
(20, 'sudheer', 'ssuri@confederationcollege.ca', 'suritest', ''),
(21, 'simar', 'skaur9@confederationcollege.ca', 'skaur9', ''),
(22, 'mansi', 'mkoyande@confederationcollege.ca', 'My10019894', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exchangerequests`
--
ALTER TABLE `exchangerequests`
  ADD PRIMARY KEY (`eid`),
  ADD KEY `requestorid` (`requestorid`),
  ADD KEY `requesteeid` (`requesteeid`),
  ADD KEY `requestorgenreid` (`requestorgenreid`),
  ADD KEY `requesteegenreid` (`requesteegenreid`);

--
-- Indexes for table `genrerating`
--
ALTER TABLE `genrerating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genreid` (`genreid`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`genreid`);

--
-- Indexes for table `loginhistory`
--
ALTER TABLE `loginhistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `userbooks`
--
ALTER TABLE `userbooks`
  ADD PRIMARY KEY (`id`,`uid`,`bookid`),
  ADD KEY `uid` (`uid`),
  ADD KEY `genreid` (`genreid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exchangerequests`
--
ALTER TABLE `exchangerequests`
  MODIFY `eid` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genrerating`
--
ALTER TABLE `genrerating`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `genreid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `loginhistory`
--
ALTER TABLE `loginhistory`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `userbooks`
--
ALTER TABLE `userbooks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exchangerequests`
--
ALTER TABLE `exchangerequests`
  ADD CONSTRAINT `exchangerequests_ibfk_1` FOREIGN KEY (`requestorid`) REFERENCES `users` (`uid`),
  ADD CONSTRAINT `exchangerequests_ibfk_2` FOREIGN KEY (`requesteeid`) REFERENCES `users` (`uid`),
  ADD CONSTRAINT `exchangerequests_ibfk_3` FOREIGN KEY (`requestorgenreid`) REFERENCES `genres` (`genreid`),
  ADD CONSTRAINT `exchangerequests_ibfk_4` FOREIGN KEY (`requesteegenreid`) REFERENCES `genres` (`genreid`);

--
-- Constraints for table `genrerating`
--
ALTER TABLE `genrerating`
  ADD CONSTRAINT `genrerating_ibfk_1` FOREIGN KEY (`genreid`) REFERENCES `genres` (`genreid`),
  ADD CONSTRAINT `genrerating_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`);

--
-- Constraints for table `loginhistory`
--
ALTER TABLE `loginhistory`
  ADD CONSTRAINT `loginhistory_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`);

--
-- Constraints for table `userbooks`
--
ALTER TABLE `userbooks`
  ADD CONSTRAINT `userbooks_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  ADD CONSTRAINT `userbooks_ibfk_2` FOREIGN KEY (`genreid`) REFERENCES `genres` (`genreid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
