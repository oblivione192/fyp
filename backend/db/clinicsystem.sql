-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: clinicsystem
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `AdminId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `joinDate` date DEFAULT NULL,
  PRIMARY KEY (`AdminId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Admin One','admin@example.com','securepassword123','2024-01-01');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `AppointmentId` int NOT NULL AUTO_INCREMENT,
  `SlotId` int DEFAULT NULL,
  `DoctorId` int DEFAULT NULL,
  `PatientId` int DEFAULT NULL,
  `visit_purpose` text,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `CONFIRMED` tinyint(1) DEFAULT '0',
  `attended` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`AppointmentId`),
  KEY `SlotId` (`SlotId`),
  KEY `DoctorId` (`DoctorId`),
  KEY `PatientId` (`PatientId`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`SlotId`) REFERENCES `slot` (`SlotId`),
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`DoctorId`) REFERENCES `doctor` (`DoctorId`),
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`PatientId`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (2,1,1,1,'Follow-up','12:00:00','12:30:00',1,0),(6,1,1,1,'Dental Checkup','09:00:00','09:30:00',1,1),(10,1,NULL,1,'Dental Checkup','09:00:00','09:30:00',0,0),(11,1,NULL,1,'Dental Checkup','09:00:00','09:30:00',0,0),(12,1,NULL,1,'Dental Checkup','09:00:00','09:30:00',1,1),(13,1,NULL,1,'Dental Checkup','09:00:00','09:30:00',0,0),(14,1,NULL,1,'Dental Checkup','09:00:00','09:30:00',0,0),(15,2,NULL,1,'Dental Checkup','10:00:00','10:30:00',0,0),(16,7,NULL,1,'Dental Checkup','13:00:00','13:30:00',0,0),(17,5,NULL,1,'Physiotherapy','09:00:00','09:30:00',1,0),(18,2,NULL,1,'Dental Checkup','10:00:00','10:30:00',0,0),(19,2,NULL,1,'Dental Checkup','10:00:00','10:30:00',0,0),(20,11,NULL,1,'Vaccination','09:00:00','10:00:00',0,0),(22,23,NULL,1,'Dental Checkup','11:00:00','12:00:00',0,0),(24,19,NULL,1,'Vaccination','11:00:00','12:00:00',0,0);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinic`
--

DROP TABLE IF EXISTS `clinic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinic` (
  `ClinicId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `registration_no` varchar(100) DEFAULT NULL,
  `address` text,
  PRIMARY KEY (`ClinicId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinic`
--

LOCK TABLES `clinic` WRITE;
/*!40000 ALTER TABLE `clinic` DISABLE KEYS */;
INSERT INTO `clinic` VALUES (1,'ABC Clinic','12003001','Jalan Seksysen 1/2, 31900 Kampar, Perak'),(2,'XYZ Medical Centre','12003002','No.32, Jalan Bandar Baru, 31900 Kampar, Perak');
/*!40000 ALTER TABLE `clinic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clinicservice`
--

DROP TABLE IF EXISTS `clinicservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clinicservice` (
  `clinic_service_id` int NOT NULL AUTO_INCREMENT,
  `clinic_id` int NOT NULL,
  `service_id` int NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `duration_minutes` int DEFAULT '30',
  PRIMARY KEY (`clinic_service_id`),
  KEY `clinic_id` (`clinic_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `clinicservice_ibfk_1` FOREIGN KEY (`clinic_id`) REFERENCES `clinic` (`ClinicId`) ON DELETE CASCADE,
  CONSTRAINT `clinicservice_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clinicservice`
--

LOCK TABLES `clinicservice` WRITE;
/*!40000 ALTER TABLE `clinicservice` DISABLE KEYS */;
INSERT INTO `clinicservice` VALUES (11,1,1,50.00,30),(12,1,2,80.00,45),(13,1,3,60.00,15),(14,2,1,80.00,30),(15,2,2,120.00,45);
/*!40000 ALTER TABLE `clinicservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `DoctorId` int NOT NULL AUTO_INCREMENT,
  `SpecialtyId` int DEFAULT NULL,
  `picture` text,
  `degree` varchar(255) DEFAULT NULL,
  `contactNo` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `mname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`DoctorId`),
  KEY `SpecialtyId` (`SpecialtyId`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`SpecialtyId`) REFERENCES `specialty` (`SpecialtyId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,1,NULL,'MBBS','012-3456789','doctor.john@example.com','1985-06-15','John','Lee','Wick');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctorenrollment`
--

DROP TABLE IF EXISTS `doctorenrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctorenrollment` (
  `DoctorId` int NOT NULL,
  `ClinicId` int NOT NULL,
  `enrollment_date` date DEFAULT NULL,
  `enrollment` varchar(255) DEFAULT NULL,
  `enrollment_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`DoctorId`,`ClinicId`),
  KEY `ClinicId` (`ClinicId`),
  CONSTRAINT `doctorenrollment_ibfk_1` FOREIGN KEY (`DoctorId`) REFERENCES `doctor` (`DoctorId`),
  CONSTRAINT `doctorenrollment_ibfk_2` FOREIGN KEY (`ClinicId`) REFERENCES `clinic` (`ClinicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctorenrollment`
--

LOCK TABLES `doctorenrollment` WRITE;
/*!40000 ALTER TABLE `doctorenrollment` DISABLE KEYS */;
INSERT INTO `doctorenrollment` VALUES (1,1,'2023-05-01','Initial Enrollment','Active');
/*!40000 ALTER TABLE `doctorenrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) NOT NULL,
  `service_description` text,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Dental Checkup','Routine dental examination and cleaning.'),(2,'Vaccination','Administration of vaccine doses as required.'),(3,'Physiotherapy','Physical therapy sessions for injury or rehabilitation.'),(4,'Blood Test','Basic and advanced blood testing services.');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slot`
--

DROP TABLE IF EXISTS `slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slot` (
  `SlotId` int NOT NULL AUTO_INCREMENT,
  `ClinicId` int DEFAULT NULL,
  `slotDate` date DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT '0',
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  PRIMARY KEY (`SlotId`),
  KEY `ClinicId` (`ClinicId`),
  CONSTRAINT `slot_ibfk_1` FOREIGN KEY (`ClinicId`) REFERENCES `clinic` (`ClinicId`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slot`
--

LOCK TABLES `slot` WRITE;
/*!40000 ALTER TABLE `slot` DISABLE KEYS */;
INSERT INTO `slot` VALUES (1,1,'2025-05-13',1,'09:00:00','09:30:00'),(2,2,'2025-05-15',1,'10:00:00','10:30:00'),(3,1,'2025-05-16',1,'10:00:00','10:30:00'),(4,1,'2025-05-16',1,'11:00:00','11:30:00'),(5,1,'2025-05-17',1,'09:00:00','09:30:00'),(6,1,'2025-05-17',1,'10:00:00','10:30:00'),(7,1,'2025-05-18',1,'13:00:00','13:30:00'),(8,1,'2025-05-18',1,'14:00:00','14:30:00'),(9,1,'2025-05-19',1,'09:00:00','09:30:00'),(10,1,'2025-05-19',1,'10:00:00','10:30:00'),(11,1,'2025-06-05',1,'09:00:00','10:00:00'),(12,2,'2025-06-10',1,'09:00:00','10:00:00'),(13,2,'2025-06-11',1,'09:00:00','10:00:00'),(14,2,'2025-06-11',1,'10:00:00','11:00:00'),(15,2,'2025-06-11',1,'11:00:00','12:00:00'),(16,2,'2025-06-11',1,'13:00:00','14:00:00'),(17,2,'2025-06-12',1,'09:00:00','10:00:00'),(18,2,'2025-06-12',1,'10:00:00','11:00:00'),(19,2,'2025-06-12',1,'11:00:00','12:00:00'),(20,2,'2025-06-12',1,'12:00:00','13:00:00'),(21,2,'2025-06-12',1,'14:00:00','15:00:00'),(22,2,'2025-06-13',1,'10:00:00','11:00:00'),(23,2,'2025-06-13',1,'11:00:00','12:00:00'),(24,2,'2025-06-13',1,'13:00:00','14:00:00'),(25,2,'2025-06-13',1,'14:00:00','15:00:00'),(26,2,'2025-06-14',1,'09:00:00','10:00:00'),(27,2,'2025-06-14',1,'10:00:00','11:00:00'),(28,2,'2025-06-14',1,'11:00:00','12:00:00'),(29,2,'2025-06-15',1,'09:00:00','10:00:00'),(30,2,'2025-06-15',1,'10:00:00','11:00:00'),(31,2,'2025-06-15',1,'11:00:00','12:00:00'),(32,2,'2025-06-15',1,'13:00:00','14:00:00');
/*!40000 ALTER TABLE `slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialty`
--

DROP TABLE IF EXISTS `specialty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialty` (
  `SpecialtyId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`SpecialtyId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialty`
--

LOCK TABLES `specialty` WRITE;
/*!40000 ALTER TABLE `specialty` DISABLE KEYS */;
INSERT INTO `specialty` VALUES (1,'General Physician','Handles general health concerns and preliminary diagnoses.');
/*!40000 ALTER TABLE `specialty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(100) DEFAULT NULL,
  `mname` varchar(100) DEFAULT NULL,
  `lname` varchar(100) DEFAULT NULL,
  `picture` text,
  `icnumber` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `joinDate` date DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Hew','Yu','Jing',NULL,'040804-08-0533','yujinghew43@gmail.com','$2b$12$2a4oLRTTalOAsftamVu7fukmwO4I7LPMnVYunMkf/vqU4Od9q8a1y','2004-08-04','Male','2025-04-22');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-12 17:30:32
