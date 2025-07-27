-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: LAPTOP-2IM51PLT    Database: clinicsystem
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
  `ClinicId` int DEFAULT NULL,
  PRIMARY KEY (`AdminId`),
  KEY `FK_CLINIC` (`ClinicId`),
  CONSTRAINT `FK_CLINIC` FOREIGN KEY (`ClinicId`) REFERENCES `clinic` (`ClinicId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `DATE_BOOKED` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`AppointmentId`),
  KEY `appointment_ibfk_1` (`SlotId`),
  KEY `appointment_ibfk_2` (`DoctorId`),
  KEY `appointment_ibfk_3` (`PatientId`),
  CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`SlotId`) REFERENCES `slot` (`SlotId`) ON DELETE CASCADE,
  CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`DoctorId`) REFERENCES `doctor` (`DoctorId`) ON DELETE CASCADE,
  CONSTRAINT `appointment_ibfk_3` FOREIGN KEY (`PatientId`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `disease`
--

DROP TABLE IF EXISTS `disease`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disease` (
  `disease_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`disease_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `diseasehistory`
--

DROP TABLE IF EXISTS `diseasehistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diseasehistory` (
  `history_id` int NOT NULL,
  `PatientId` int DEFAULT NULL,
  `disease_id` int DEFAULT NULL,
  `diagnosed_date` date DEFAULT NULL,
  PRIMARY KEY (`history_id`),
  KEY `PatientId` (`PatientId`),
  KEY `disease_id` (`disease_id`),
  CONSTRAINT `diseasehistory_ibfk_1` FOREIGN KEY (`PatientId`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `diseasehistory_ibfk_2` FOREIGN KEY (`disease_id`) REFERENCES `disease` (`disease_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `healthrecord`
--

DROP TABLE IF EXISTS `healthrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `healthrecord` (
  `RecordId` int NOT NULL AUTO_INCREMENT,
  `PatientId` int NOT NULL,
  `blood_type` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `diagnosis` text,
  `notes` text,
  `recorded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `height` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `bmi` decimal(5,2) GENERATED ALWAYS AS ((`weight` / pow((`height` / 100),2))) STORED,
  PRIMARY KEY (`RecordId`),
  KEY `PatientId` (`PatientId`),
  CONSTRAINT `healthrecord_ibfk_1` FOREIGN KEY (`PatientId`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medication`
--

DROP TABLE IF EXISTS `medication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medication` (
  `MedicationId` int NOT NULL AUTO_INCREMENT,
  `AppointmentId` int DEFAULT NULL,
  `PatientId` int NOT NULL,
  `prescription` text,
  `medication_name` varchar(255) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `duration_days` int DEFAULT NULL,
  `diagnosis` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MedicationId`),
  KEY `AppointmentId` (`AppointmentId`),
  KEY `PatientId` (`PatientId`),
  KEY `diagnosis` (`diagnosis`),
  CONSTRAINT `medication_ibfk_1` FOREIGN KEY (`AppointmentId`) REFERENCES `appointment` (`AppointmentId`) ON DELETE CASCADE,
  CONSTRAINT `medication_ibfk_2` FOREIGN KEY (`PatientId`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `DATE_ADDED` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`SlotId`),
  KEY `ClinicId` (`ClinicId`),
  CONSTRAINT `slot_ibfk_1` FOREIGN KEY (`ClinicId`) REFERENCES `clinic` (`ClinicId`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `address` text,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-27 23:18:59
