-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: course_platform
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('7bf214b8-909f-488f-a4e4-54b809df7d75','e425951e14dff7d358fc8dc50d45453346517a2929e163350b4af025bb985d4c','2025-12-27 08:11:47.652','20251218233144_init',NULL,NULL,'2025-12-27 08:11:46.908',1),('82252ece-b417-4110-a759-7a5bfce6c23e','d2e651c261468399561ab6363ab1b9afc91ebefdbb0a144f4f86ad570a2c17d3','2026-01-04 10:12:51.584','20260104101250_y',NULL,NULL,'2026-01-04 10:12:50.951',1),('8a5cd7a4-fe56-4724-9dce-8d61cc1f963e','6763fd04a985752b7f006e5f472e3ece2650a1c8b9dd6261dcdb091de7e269c8','2026-01-04 09:52:34.038','20260104095233_y',NULL,NULL,'2026-01-04 09:52:33.981',1),('98cb6428-a6c8-4eb8-9586-f6b0cf32809f','c723afe53de929e6b4aa3f0e8fe95c95cbd9cb5f0728d560fcca4e3483f08ead','2025-12-27 08:11:48.352','20251219073011_add_sections_tests_certificates_faqs_comments',NULL,NULL,'2025-12-27 08:11:47.683',1),('ab262ccb-5c6e-4d64-a032-def61a6443ca','1d1231abca5d9f1e78e8d96879218c735107ce10213e5688071492bbb20c9ab3','2025-12-27 08:11:49.541','20251226114750_add_course_rating',NULL,NULL,'2025-12-27 08:11:49.442',1),('b68c5dd1-a791-432a-92eb-42fac46cc015','6af92a92e5942dc42b3065ebc31c72e965b1f6a5beafd2a7114f7baf19f99a3f','2025-12-27 08:11:47.682','20251219051421_add_category_image',NULL,NULL,'2025-12-27 08:11:47.653',1),('c97cedbe-a1d9-4525-89b0-03090330633d','23c36eba7c4226c37c2cc6b6dbaf6f466b5cd62032830ae540e3c97a79c2b698','2025-12-27 08:11:49.441','20251226113102_add_teacher_rating',NULL,NULL,'2025-12-27 08:11:49.071',1),('d7494ca5-7aaa-49fc-bd39-d16d39e64958','bd9792571e9f1fd0317cb17a8a80c36e5b6902eb1356876760a08de674ef21af','2025-12-27 08:11:49.070','20251226083519_add_promo_codes',NULL,NULL,'2025-12-27 08:11:48.353',1),('fec682ec-5929-40ca-b591-b371714f2f8b','a37ed2bef12eee0f2319cda285c429c6a5188d1ed6c3f6f8df5464113d7500ad','2025-12-27 08:11:49.622','20251227065828_add_section_isfree_and_comment_images',NULL,NULL,'2025-12-27 08:11:49.543',1),('ff37c8b5-dc6b-4927-ae2e-c2f1bfdb6f4c','9926661c71517bbf60b6c4db1d16f49dbcba9093c1e0d6f0c5ba78dbc67c060f','2026-01-05 07:53:47.478','20260105075347_add_subscription_features',NULL,NULL,'2026-01-05 07:53:47.397',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banner`
--

DROP TABLE IF EXISTS `banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `courseId` int DEFAULT NULL,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Banner_isActive_idx` (`isActive`),
  KEY `Banner_courseId_idx` (`courseId`),
  CONSTRAINT `Banner_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banner`
--

LOCK TABLES `banner` WRITE;
/*!40000 ALTER TABLE `banner` DISABLE KEYS */;
INSERT INTO `banner` VALUES (40,'Flutter Development','Zero dan professional darajagacha','https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',NULL,'/courses/61',1,1,'2026-01-14 08:39:37.458','2026-01-14 08:39:37.458'),(41,'UI/UX Design','Professional dizayner bo\'ling','https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',NULL,'/courses/64',1,3,'2026-01-14 08:39:37.458','2026-01-14 08:39:37.458'),(42,'Backend Development','NestJS bilan zamonaviy backend yarating','https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',NULL,'/courses/63',1,2,'2026-01-14 08:39:37.458','2026-01-14 08:39:37.458');
/*!40000 ALTER TABLE `banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameUz` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Category_name_idx` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (66,'Marketing','Marketing','https://api.iconify.design/mdi:chart-line.svg',1,'2026-01-14 08:39:34.244','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'),(67,'Business','Biznes','https://api.iconify.design/mdi:briefcase.svg',1,'2026-01-14 08:39:34.244','https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400'),(68,'IT & Programming','IT va Dasturlash','https://api.iconify.design/mdi:code-braces.svg',1,'2026-01-14 08:39:34.244','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'),(69,'Languages','Tillar','https://api.iconify.design/mdi:translate.svg',1,'2026-01-14 08:39:34.244','https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400'),(70,'Design','Dizayn','https://api.iconify.design/mdi:palette.svg',1,'2026-01-14 08:39:34.244','https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int DEFAULT NULL,
  `testResultId` int NOT NULL,
  `certificateNo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `pdfUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Certificate_testResultId_key` (`testResultId`),
  UNIQUE KEY `Certificate_certificateNo_key` (`certificateNo`),
  KEY `Certificate_userId_idx` (`userId`),
  KEY `Certificate_certificateNo_idx` (`certificateNo`),
  CONSTRAINT `Certificate_testResultId_fkey` FOREIGN KEY (`testResultId`) REFERENCES `testresult` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Certificate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
INSERT INTO `certificate` VALUES (5,171,NULL,7,'CERT-1768383688927-171','2026-01-14 09:41:28.929','/uploads/certificates/CERT-1768383688927-171.pdf');
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacherId` int NOT NULL,
  `categoryId` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `thumbnail` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  `freeVideosCount` int NOT NULL DEFAULT '0',
  `duration` int DEFAULT NULL,
  `level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `totalStudents` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `hasCertificate` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `Course_teacherId_idx` (`teacherId`),
  KEY `Course_categoryId_idx` (`categoryId`),
  KEY `Course_title_idx` (`title`),
  CONSTRAINT `Course_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Course_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (61,157,68,'Flutter Development','Zero dan professional darajagacha','Bu kursda siz Flutter yordamida iOS va Android uchun mobil ilovalar yaratishni o\'rganasiz. Clean Architecture, BLoC, va ko\'plab amaliy loyihalar.','/uploads/course/1768379975960-i3o2hr.jpg',250000.00,0,3,1200,'O\'rta',4.80,1251,1,'2026-01-14 08:39:37.071','2026-01-14 09:40:39.127',1),(62,157,68,'React Native Complete Guide','Cross-platform mobile development','React Native orqali iOS va Android uchun mobil ilovalar yarating. Expo, Navigation, Redux, va ko\'proq.','/uploads/course/1768379975963-ctz2qj.jpg',280000.00,0,2,1000,'O\'rta',4.00,921,1,'2026-01-14 08:39:37.071','2026-01-14 09:43:14.622',1),(63,161,68,'NestJS Backend Development','Zamonaviy backend yaratish','NestJS framework yordamida professional backend API yaratishni o\'rganasiz. TypeScript, Prisma, PostgreSQL, JWT authentication.','/uploads/course/1768379975961-3iujjf.jpg',300000.00,0,2,900,'Yuqori',4.90,850,1,'2026-01-14 08:39:37.071','2026-01-14 08:39:37.071',1),(64,163,70,'UI/UX Design Masterclass','Figma va Adobe XD bilan dizayn','Zamonaviy mobil va web dizayn yaratishni o\'rganasiz. User research, wireframing, prototyping, va final design.','/uploads/course/1768379975962-7odog.jpg',200000.00,0,4,750,'O\'rta',4.90,1500,1,'2026-01-14 08:39:37.071','2026-01-14 08:39:37.071',1),(65,161,68,'Python Foundation','Dasturlashni o\'rganishni boshlang','Python tilida dasturlash asoslari. Variables, loops, functions, OOP va ko\'proq. Bepul kurs!','/uploads/course/1768379975961-k7vqfq.jpg',0.00,1,15,600,'Boshlang\'ich',4.70,2100,1,'2026-01-14 08:39:37.071','2026-01-14 08:39:37.071',0);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursecomment`
--

DROP TABLE IF EXISTS `coursecomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursecomment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int DEFAULT NULL,
  `screenshots` text COLLATE utf8mb4_unicode_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `images` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `CourseComment_userId_idx` (`userId`),
  KEY `CourseComment_courseId_idx` (`courseId`),
  KEY `CourseComment_createdAt_idx` (`createdAt`),
  CONSTRAINT `CourseComment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CourseComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursecomment`
--

LOCK TABLES `coursecomment` WRITE;
/*!40000 ALTER TABLE `coursecomment` DISABLE KEYS */;
INSERT INTO `coursecomment` VALUES (42,170,61,'Videolar juda sifatli. Amaliy loyihalar katta yordam berdi.',5,NULL,1,'2026-01-14 08:39:39.233','2026-01-14 08:39:39.233',NULL),(43,170,61,'Juda zo\'r kurs! Barcha narsani tushuntirib berishdi. Rahmat!',5,'[\"https://picsum.photos/seed/c1/800/600\"]',1,'2026-01-14 08:39:39.233','2026-01-14 08:39:39.233',NULL);
/*!40000 ALTER TABLE `coursecomment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursefaq`
--

DROP TABLE IF EXISTS `coursefaq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursefaq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `CourseFAQ_courseId_idx` (`courseId`),
  CONSTRAINT `CourseFAQ_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursefaq`
--

LOCK TABLES `coursefaq` WRITE;
/*!40000 ALTER TABLE `coursefaq` DISABLE KEYS */;
INSERT INTO `coursefaq` VALUES (55,61,'Kursda qanday loyihalar yasaymiz?','To\'rt katta loyiha: E-commerce ilova, Chat messenger, Weather app, va Portfolio website. Har bir loyiha real dunyo ilovalarining namunasi.',3,'2026-01-14 08:39:38.991'),(56,61,'Bu kursdan nma foyda?','Siz Flutter yordamida professional mobil ilovalar yaratishni o\'rganasiz. iOS va Android uchun bitta kod bilan ilova yaratish, Clean Architecture, State Management va ko\'plab amaliy loyihalar.',1,'2026-01-14 08:39:38.991'),(57,63,'NestJS nima va nima uchun o\'rganish kerak?','NestJS - bu Node.js uchun progressive framework. TypeScript bilan ishlaydi, modulli arxitekturaga ega va enterprise darajadagi backend ilovalar yaratish uchun eng yaxshi tanlovlardan biri.',1,'2026-01-14 08:39:38.991'),(58,65,'Grafik dizayndan tushuncham yo\'q, bu kursni o\'rganolaymanmi?','Ha, albatta! Bu kurs noldan boshlanadi. Siz Adobe Photoshop va Illustrator dasturlarini o\'rganasiz, ranglar nazariyasi, kompozitsiya va professional dizayn yaratish ko\'nikmalarini egallaysiz.',1,'2026-01-14 08:39:38.991'),(59,61,'Flutter developer bo\'lish uchun qancha vaqt kerak?','Agar har kuni 2-3 soat mashq qilsangiz, 3-6 oy ichida junior Flutter developer bo\'lishingiz mumkin. Bu kurs sizga kerakli barcha bilimlarni beradi.',2,'2026-01-14 08:39:38.991'),(60,65,'Kurs tugagach qanday ish topishim mumkin?','Grafik dizayner, Branding specialist, Social media designer, Freelance designer sifatida ishlay olasiz. Shuningdek, o\'zingizning dizayn studiyangizni ochishingiz mumkin.',2,'2026-01-14 08:39:38.991'),(61,63,'Bu kursda nimalarni o\'rganaman?','REST API yaratish, PostgreSQL bilan ishlash, Authentication va Authorization, Real-time chat WebSocket bilan, File upload, va production-ready backend yaratish.',2,'2026-01-14 08:39:38.991');
/*!40000 ALTER TABLE `coursefaq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courserating`
--

DROP TABLE IF EXISTS `courserating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courserating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `rating` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CourseRating_userId_courseId_key` (`userId`,`courseId`),
  KEY `CourseRating_userId_idx` (`userId`),
  KEY `CourseRating_courseId_idx` (`courseId`),
  KEY `CourseRating_rating_idx` (`rating`),
  CONSTRAINT `CourseRating_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CourseRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courserating`
--

LOCK TABLES `courserating` WRITE;
/*!40000 ALTER TABLE `courserating` DISABLE KEYS */;
INSERT INTO `courserating` VALUES (12,171,62,4,'2026-01-14 09:43:14.619','2026-01-14 09:43:14.619');
/*!40000 ALTER TABLE `courserating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollment`
--

DROP TABLE IF EXISTS `enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `enrolledAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expiresAt` datetime(3) DEFAULT NULL,
  `subscriptionDuration` enum('ONE_MONTH','SIX_MONTHS','ONE_YEAR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ONE_YEAR',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Enrollment_userId_courseId_key` (`userId`,`courseId`),
  KEY `Enrollment_userId_idx` (`userId`),
  KEY `Enrollment_courseId_idx` (`courseId`),
  KEY `Enrollment_expiresAt_idx` (`expiresAt`),
  KEY `Enrollment_isActive_idx` (`isActive`),
  CONSTRAINT `Enrollment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Enrollment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollment`
--

LOCK TABLES `enrollment` WRITE;
/*!40000 ALTER TABLE `enrollment` DISABLE KEYS */;
INSERT INTO `enrollment` VALUES (32,170,61,1,'2026-01-14 08:39:39.192',NULL,'ONE_YEAR'),(33,170,65,1,'2026-01-14 08:39:39.192',NULL,'ONE_YEAR'),(34,171,61,1,'2026-01-14 09:40:39.123','2026-02-14 09:40:39.121','ONE_MONTH'),(35,171,62,1,'2026-01-14 09:42:52.357','2026-02-14 09:42:52.355','ONE_MONTH');
/*!40000 ALTER TABLE `enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Feedback_userId_courseId_key` (`userId`,`courseId`),
  KEY `Feedback_userId_idx` (`userId`),
  KEY `Feedback_courseId_idx` (`courseId`),
  KEY `Feedback_rating_idx` (`rating`),
  CONSTRAINT `Feedback_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (11,170,61,5,'Juda zo\'r kurs! Hammaga tavsiya qilaman.','2026-01-14 08:39:39.209','2026-01-14 08:39:39.209');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Notification_userId_idx` (`userId`),
  KEY `Notification_isRead_idx` (`isRead`),
  KEY `Notification_createdAt_idx` (`createdAt`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=984 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (963,170,'Balans to\'ldirish uchun bonus!','100,000 so\'m va undan ko\'proq to\'ldirsangiz 10% bonus oling!','discount','discount','/profile/balance',0,'2026-01-14 03:39:39.342','https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=200&fit=crop'),(964,170,'Xush kelibsiz!','Platformamizga xush kelibsiz! Eng yaxshi kurslarni o\'rganing.','course','school','/courses',0,'2026-01-14 08:39:39.344','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop'),(965,170,'Maxsus chegirma!','Barcha kurslarga 20% chegirma! Faqat 3 kun.','discount','discount','/courses',0,'2026-01-14 08:39:39.344','https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop'),(966,170,'Yangi kurs qo\'shildi','Flutter Development kursi sizga mos keladi. Hoziroq boshlang!','course','school','/courses/1',0,'2026-01-14 08:39:39.344','https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=400&h=200&fit=crop'),(967,170,'Yangi video darslar','Backend Development kursiga 5 ta yangi video dars qo\'shildi','video','play_circle','/courses/2',0,'2026-01-14 06:39:39.341','https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop'),(968,170,'Maxsus chegirma!','SALE50 promo kodi bilan 50% chegirma oling. Faqat bugun!','discount','mdi:sale','/promo/SALE50',0,'2026-01-14 08:39:39.558','https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'),(969,170,'Yangi dars qo\'shildi','Flutter kursingizga 5 ta yangi video dars qo\'shildi. Ko\'rib chiqing!','video','mdi:video','/courses/1/videos',0,'2026-01-14 08:39:39.558','https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400'),(970,170,'Yangi kurs qo\'shildi!','Flutter Mobile Development kursi hozir mavjud. 30% chegirma bilan sotib oling!','course','mdi:school','/courses/1',0,'2026-01-14 08:39:39.558','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'),(971,170,'React.js kursi boshlanmoqda','Siz yozilgan React.js Advanced kursi 3 kundan keyin boshlanadi. Tayyorlaning!','course','mdi:react','/courses/2',0,'2026-01-14 08:39:39.558','https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),(972,170,'Balansga pul qo\'shildi','Hisobingizga 500,000 so\'m qo\'shildi. Endi yangi kurslar sotib olishingiz mumkin!','payment','mdi:wallet','/profile/balance',1,'2026-01-14 08:39:39.558',NULL),(973,170,'Sertifikat tayyor!','Flutter Mobile Development kursi uchun sertifikatingiz tayyor. Yuklab oling!','certificate','mdi:certificate','/certificates/1',1,'2026-01-14 08:39:39.558','https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'),(974,170,'Tug\'ilgan kuningiz muborak!','Tug\'ilgan kuningiz munosabati bilan 20% chegirma sovg\'asi! BIRTHDAY20 kodini ishlating.','special','mdi:cake-variant','/promo/BIRTHDAY20',0,'2026-01-14 08:39:39.558',NULL),(975,170,'Testdan o\'tdingiz!','Flutter asoslari testidan 95/100 ball bilan o\'tdingiz. Ajoyib natija!','test','mdi:clipboard-check','/tests/results/1',1,'2026-01-14 08:39:39.558',NULL),(976,170,'Yangilanish mavjud','Ilova versiyasi 2.0 chiqdi. Yangi xususiyatlar va tezkor ishlash!','system','mdi:update','/updates',0,'2026-01-14 08:39:39.558',NULL),(977,170,'Yangi ustoz qo\'shildi','Sherzod Turdibekov - Python Senior Developer platformaga qo\'shildi. Kurslarini ko\'ring!','teacher','mdi:account-tie','/teachers/5',0,'2026-01-14 08:39:39.558','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'),(978,171,'Bepul kurslar sizni kutmoqda!','Platformada ko\'plab bepul kurslar mavjud. Hoziroq boshlang!','course','school','/courses',0,'2026-01-14 08:46:36.213',NULL),(979,171,'Xush kelibsiz! 🎉','Platformamizga xush kelibsiz! Eng yaxshi kurslarni o\'rganing va yangi ko\'nikmalar egallab oling.','course','school','/courses',1,'2026-01-14 08:46:36.250',NULL),(980,171,'Maxsus taklif! 💰','Birinchi xaridingizda 20% chegirma! Faqat sizlar uchun.','discount','discount','/courses',1,'2026-01-14 08:46:36.250',NULL),(981,171,'Bepul kurslar sizni kutmoqda!','Platformada ko\'plab bepul kurslar mavjud. Hoziroq boshlang!','course','school','/courses',1,'2026-01-14 09:42:18.360',NULL),(982,171,'Xush kelibsiz! 🎉','Platformamizga xush kelibsiz! Eng yaxshi kurslarni o\'rganing va yangi ko\'nikmalar egallab oling.','course','school','/courses',0,'2026-01-14 09:42:18.362',NULL),(983,171,'Maxsus taklif! 💰','Birinchi xaridingizda 20% chegirma! Faqat sizlar uchun.','discount','discount','/courses',0,'2026-01-14 09:42:18.362',NULL);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('CLICK','PAYME','UZUM','BALANCE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `transactionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `type` enum('COURSE_PURCHASE','BALANCE_TOPUP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COURSE_PURCHASE',
  `discount` decimal(10,2) DEFAULT NULL,
  `originalAmount` decimal(10,2) DEFAULT NULL,
  `promoCodeId` int DEFAULT NULL,
  `subscriptionDuration` enum('ONE_MONTH','SIX_MONTHS','ONE_YEAR') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Payment_transactionId_key` (`transactionId`),
  KEY `Payment_userId_idx` (`userId`),
  KEY `Payment_transactionId_idx` (`transactionId`),
  KEY `Payment_status_idx` (`status`),
  KEY `Payment_courseId_idx` (`courseId`),
  KEY `Payment_type_idx` (`type`),
  KEY `Payment_promoCodeId_idx` (`promoCodeId`),
  CONSTRAINT `Payment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Payment_promoCodeId_fkey` FOREIGN KEY (`promoCodeId`) REFERENCES `promocode` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (104,170,65,200000.00,'UZUM','SUCCESS','UZUM_1768379979458_4','2025-12-30 08:39:39.458','2026-01-14 08:39:39.459','2026-01-14 08:39:39.459','COURSE_PURCHASE',NULL,NULL,NULL,NULL),(105,170,NULL,500000.00,'CLICK','SUCCESS','TOPUP_CLK_1768379979458_1','2025-12-25 08:39:39.458','2026-01-14 08:39:39.459','2026-01-14 08:39:39.459','BALANCE_TOPUP',NULL,NULL,NULL,NULL),(106,170,61,250000.00,'BALANCE','SUCCESS','BAL_1768379979458_1','2026-01-09 08:39:39.458','2026-01-14 08:39:39.459','2026-01-14 08:39:39.459','COURSE_PURCHASE',NULL,NULL,NULL,NULL),(107,170,NULL,300000.00,'PAYME','SUCCESS','TOPUP_PAYME_1768379979458_2','2025-12-30 08:39:39.458','2026-01-14 08:39:39.459','2026-01-14 08:39:39.459','BALANCE_TOPUP',NULL,NULL,NULL,NULL),(108,170,63,300000.00,'PAYME','SUCCESS','PAYME_1768379979458_3','2026-01-04 08:39:39.458','2026-01-14 08:39:39.459','2026-01-14 08:39:39.459','COURSE_PURCHASE',NULL,NULL,NULL,NULL),(109,171,NULL,1000000.00,'UZUM','SUCCESS','TOPUP-1768383637405-seohlzysh','2026-01-14 09:40:37.730','2026-01-14 09:40:37.406','2026-01-14 09:40:37.741','BALANCE_TOPUP',NULL,NULL,NULL,NULL),(110,171,61,250000.00,'BALANCE','SUCCESS','BAL-1768383639117-vqahi9meo','2026-01-14 09:40:39.117','2026-01-14 09:40:39.119','2026-01-14 09:40:39.119','COURSE_PURCHASE',0.00,250000.00,NULL,'ONE_MONTH'),(111,171,62,280000.00,'BALANCE','SUCCESS','BAL-1768383772351-cuxwdshqr','2026-01-14 09:42:52.351','2026-01-14 09:42:52.352','2026-01-14 09:42:52.352','COURSE_PURCHASE',0.00,280000.00,NULL,'ONE_MONTH');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocode`
--

DROP TABLE IF EXISTS `promocode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discountPercent` int DEFAULT NULL,
  `type` enum('SINGLE_USE','USER_SINGLE_USE','UNLIMITED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER_SINGLE_USE',
  `maxUsageCount` int DEFAULT NULL,
  `currentUsageCount` int NOT NULL DEFAULT '0',
  `expiresAt` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `discountAmount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PromoCode_code_key` (`code`),
  KEY `PromoCode_code_idx` (`code`),
  KEY `PromoCode_isActive_idx` (`isActive`),
  KEY `PromoCode_expiresAt_idx` (`expiresAt`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocode`
--

LOCK TABLES `promocode` WRITE;
/*!40000 ALTER TABLE `promocode` DISABLE KEYS */;
INSERT INTO `promocode` VALUES (49,'FIRST15',15,'USER_SINGLE_USE',NULL,0,'2026-02-13 08:39:39.516',1,'2026-01-14 08:39:39.524','2026-01-14 08:39:39.524',NULL),(50,'NEWUSER20',20,'USER_SINGLE_USE',NULL,0,'2026-02-13 08:39:39.516',1,'2026-01-14 08:39:39.524','2026-01-14 08:39:39.524',NULL),(51,'WELCOME10',10,'USER_SINGLE_USE',NULL,0,'2026-02-13 08:39:39.516',1,'2026-01-14 08:39:39.524','2026-01-14 08:39:39.524',NULL),(52,'SALE50',50,'SINGLE_USE',1,0,'2026-01-21 08:39:39.516',1,'2026-01-14 08:39:39.524','2026-01-14 08:39:39.524',NULL),(53,'SAVE50000',NULL,'USER_SINGLE_USE',NULL,0,'2026-02-13 08:39:39.519',1,'2026-01-14 08:39:39.524','2026-01-14 08:39:39.524',50000.00),(54,'GIFT100000',NULL,'SINGLE_USE',1,0,'2026-01-21 08:39:39.519',1,'2026-01-14 08:39:39.524','2026-01-14 08:39:39.524',100000.00);
/*!40000 ALTER TABLE `promocode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocodeusage`
--

DROP TABLE IF EXISTS `promocodeusage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocodeusage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `promoCodeId` int NOT NULL,
  `courseId` int NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `usedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `PromoCodeUsage_userId_promoCodeId_key` (`userId`,`promoCodeId`),
  KEY `PromoCodeUsage_userId_idx` (`userId`),
  KEY `PromoCodeUsage_promoCodeId_idx` (`promoCodeId`),
  KEY `PromoCodeUsage_courseId_idx` (`courseId`),
  CONSTRAINT `PromoCodeUsage_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `PromoCodeUsage_promoCodeId_fkey` FOREIGN KEY (`promoCodeId`) REFERENCES `promocode` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PromoCodeUsage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocodeusage`
--

LOCK TABLES `promocodeusage` WRITE;
/*!40000 ALTER TABLE `promocodeusage` DISABLE KEYS */;
/*!40000 ALTER TABLE `promocodeusage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savedcourse`
--

DROP TABLE IF EXISTS `savedcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savedcourse` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `courseId` int NOT NULL,
  `savedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `SavedCourse_userId_courseId_key` (`userId`,`courseId`),
  KEY `SavedCourse_userId_idx` (`userId`),
  KEY `SavedCourse_courseId_idx` (`courseId`),
  CONSTRAINT `SavedCourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SavedCourse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savedcourse`
--

LOCK TABLES `savedcourse` WRITE;
/*!40000 ALTER TABLE `savedcourse` DISABLE KEYS */;
INSERT INTO `savedcourse` VALUES (10,171,63,'2026-01-14 09:21:21.283');
/*!40000 ALTER TABLE `savedcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `order` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `Section_courseId_idx` (`courseId`),
  KEY `Section_order_idx` (`order`),
  CONSTRAINT `Section_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
INSERT INTO `section` VALUES (111,61,'Boshlang\'ich: Flutter asoslari','Flutter bilan tanishish va asosiy konseptlar',1,1,'2026-01-14 08:39:37.818','2026-01-14 08:39:37.818',0),(112,61,'Widgetlar va Layout','Flutter widgetlari bilan ishlash',2,1,'2026-01-14 08:39:38.008','2026-01-14 08:39:38.008',0),(113,63,'Boshlang\'ich qism',NULL,1,1,'2026-01-14 08:39:39.141','2026-01-14 08:39:39.141',1),(114,65,'Boshlang\'ich qism',NULL,1,1,'2026-01-14 08:39:39.148','2026-01-14 08:39:39.148',1),(115,64,'Boshlang\'ich qism',NULL,1,1,'2026-01-14 08:39:39.157','2026-01-14 08:39:39.157',1),(116,62,'Boshlang\'ich qism',NULL,1,1,'2026-01-14 08:39:39.162','2026-01-14 08:39:39.162',1);
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `categories` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` double NOT NULL DEFAULT '0',
  `totalRatings` int NOT NULL DEFAULT '0',
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Teacher_email_key` (`email`),
  UNIQUE KEY `Teacher_userId_key` (`userId`),
  KEY `Teacher_email_idx` (`email`),
  KEY `Teacher_userId_idx` (`userId`),
  CONSTRAINT `Teacher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=169 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (157,'Akmal Ergashev','5 yillik tajribaga ega Flutter dasturchi. Google Developer Expert. 20+ mobil ilovalar yaratgan va 50+ startup loyihalarda ishtirok etgan. MIT dan kompyuter fanlari bo\'yicha magistr darajasi.','akmal@example.com','+998901234567','/uploads/teacher/1768379974423-75kqyg.jpg',1,'2026-01-14 08:39:35.534','2026-01-14 08:39:35.534','Flutter,Mobile Development,Dart,Firebase',4.9,2847,NULL),(158,'Javohir Ismoilov','DevOps Engineer @ Microsoft Azure. Kubernetes Certified Administrator. CI/CD pipelines va cloud infrastructure bo\'yicha 7+ yillik tajriba. 500+ server infratuzilmasini boshqargan.','javohir@example.com','+998901234572','/uploads/teacher/1768379974593-1oqyzq.jpg',1,'2026-01-14 08:39:35.534','2026-01-14 08:39:35.534','DevOps,Docker,Kubernetes,AWS,Azure,CI/CD',4.8,2234,NULL),(159,'Bobur Yuldashev','iOS Developer @ Apple. Swift va SwiftUI bo\'yicha ekspert. 15+ AppStore Featured ilovalar yaratgan. WWDC Speaker va iOS community leader.','bobur@example.com','+998901234574','/uploads/teacher/1768379974597-trcbgp.jpg',1,'2026-01-14 08:39:35.534','2026-01-14 08:39:35.534','iOS,Swift,SwiftUI,Mobile Development,Xcode',4.9,1876,NULL),(160,'Rustam Olimov','Blockchain Developer va Smart Contract Auditor. Ethereum va Solana ecosystemda 5+ yillik tajriba. 20+ DeFi loyihalar yaratgan va $100M+ auditlarni o\'tkazgan.','rustam@example.com','+998901234576','/uploads/teacher/1768379974603-jpfuyo.jpg',1,'2026-01-14 08:39:35.534','2026-01-14 08:39:35.534','Blockchain,Solidity,Web3,Smart Contracts,DeFi',4.9,987,NULL),(161,'Dilshod Karimov','Senior Backend Engineer @ Yandex. 8+ yillik tajriba. Mikroservislar, API Development, va Cloud Architecture bo\'yicha mutaxassis. 100+ mijozlarga backend yechimlar yaratgan.','dilshod@example.com','+998901234568','/uploads/teacher/1768379974587-87fu7v.jpg',1,'2026-01-14 08:39:35.534','2026-01-14 08:39:35.534','Backend,Node.js,Python,API Development,AWS',4.9,3521,NULL),(162,'Shoira Karimova','English Language Teacher va IELTS Trainer. Cambridge CELTA certified. 12+ yillik tajriba. 5000+ talabalarni IELTS 7+ ball olishga yordam bergan.','shoira@example.com','+998901234577','/uploads/teacher/1768379974607-kg5itr.jpg',1,'2026-01-14 08:39:35.535','2026-01-14 08:39:35.535','English,IELTS,Language Teaching,Communication Skills',4.9,3987,NULL),(163,'Nigora Saidova','Lead UI/UX Designer @ EPAM. Adobe Certified Professional. 6+ yillik tajriba. 200+ loyihalarni dizayn qilgan. Awwwards va CSS Design Awards sovrindori.','nigora@example.com','+998901234569','/uploads/teacher/1768379974589-f0krgb.jpg',1,'2026-01-14 08:39:35.535','2026-01-14 08:39:35.535','UI/UX Design,Figma,Adobe XD,Web Design',4.8,1986,NULL),(164,'Dildora Ahmadova','Digital Marketing Strategist. Google va Meta Certified Trainer. 50+ brendlar bilan ishlagan. E-commerce va social media marketing bo\'yicha 9+ yillik tajriba.','dildora@example.com','+998901234573','/uploads/teacher/1768379974595-h122e.jpg',1,'2026-01-14 08:39:35.535','2026-01-14 08:39:35.535','Digital Marketing,SMM,SEO,Google Ads,Content Marketing',4.7,3456,NULL),(165,'Zilola Nazarova','Motion Designer va Video Editor. Adobe After Effects va Premiere Pro Certified. 1000+ kommersial videolar yaratgan. Netflix va Disney+ uchun ishlagan.','zilola@example.com','+998901234575','/uploads/teacher/1768379974600-gazxk6.jpg',1,'2026-01-14 08:39:35.534','2026-01-14 08:39:35.534','Motion Design,Video Editing,After Effects,Premiere Pro,Animation',4.8,2145,NULL),(166,'Aziz Rahmonov','Game Developer @ Unity Technologies. 10+ yillik tajriba. 30+ mobil o\'yinlar yaratgan, ularning 5 tasi App Store Featured. Unity Certified Expert.','aziz@example.com','+998901234578','/uploads/teacher/1768379974622-yx541.jpg',1,'2026-01-14 08:39:35.535','2026-01-14 08:39:35.535','Game Development,Unity,C#,2D/3D Games,Mobile Games',4.8,2678,NULL),(167,'Malika Tursunova','Data Science va Machine Learning Specialist @ Google AI. Stanford dan PhD darajasi. Kaggle Grandmaster. 30+ research papers nashr etgan.','malika@example.com','+998901234571','/uploads/teacher/1768379974592-cv1ur8.jpg',1,'2026-01-14 08:39:35.535','2026-01-14 08:39:35.535','Data Science,Machine Learning,Python,AI,Deep Learning',5,1567,NULL),(168,'Sardor Rahimov','Full Stack Developer va Startup Mentor. Y Combinator dasturida qatnashgan. React, Next.js, va zamonaviy web texnologiyalar bo\'yicha ekspert. 10+ muvaffaqiyatli startup yaratgan.','sardor@example.com','+998901234570','/uploads/teacher/1768379974590-syp0xn.jpg',1,'2026-01-14 08:39:35.536','2026-01-14 08:39:35.536','React,Next.js,Full Stack,JavaScript,TypeScript',4.9,4123,NULL);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacherrating`
--

DROP TABLE IF EXISTS `teacherrating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacherrating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `teacherId` int NOT NULL,
  `rating` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TeacherRating_userId_teacherId_key` (`userId`,`teacherId`),
  KEY `TeacherRating_userId_idx` (`userId`),
  KEY `TeacherRating_teacherId_idx` (`teacherId`),
  KEY `TeacherRating_rating_idx` (`rating`),
  CONSTRAINT `TeacherRating_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TeacherRating_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacherrating`
--

LOCK TABLES `teacherrating` WRITE;
/*!40000 ALTER TABLE `teacherrating` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacherrating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration` int NOT NULL,
  `passingScore` int NOT NULL DEFAULT '70',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `availabilityType` enum('ANYTIME','DAILY','EVERY_3_DAYS','WEEKLY','MONTHLY','YEARLY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ANYTIME',
  `availableAfterDays` int NOT NULL DEFAULT '0',
  `maxDuration` int NOT NULL DEFAULT '60',
  `minCorrectAnswers` int NOT NULL DEFAULT '18',
  PRIMARY KEY (`id`),
  KEY `Test_courseId_idx` (`courseId`),
  CONSTRAINT `Test_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (76,61,'Flutter Asoslari - Boshlang\'ich Test','Kurs sotib olingandan keyin darhol topshirish mumkin',20,70,1,'2026-01-14 08:39:38.361','2026-01-14 08:39:38.361','ANYTIME',0,60,8),(77,61,'Flutter O\'rta Daraja - Haftalik Test','Kurs sotib olingandan 7 kun o\'tgach, har haftada topshirish mumkin',30,75,1,'2026-01-14 08:39:38.589','2026-01-14 08:39:38.589','WEEKLY',7,60,15),(78,61,'Flutter Final Test','Kurs sotib olingandan 14 kun o\'tgach, har 3 kunda topshirish mumkin',45,80,1,'2026-01-14 08:39:38.772','2026-01-14 08:39:38.772','EVERY_3_DAYS',14,60,18),(79,63,'NestJS Asoslari - Katta Test','30 savollik to\'liq test',45,70,1,'2026-01-14 08:39:39.039','2026-01-14 08:39:39.039','ANYTIME',0,60,21),(80,63,'NestJS O\'rta Daraja - Test','20 savollik o\'rta daraja test',30,75,1,'2026-01-14 08:39:39.070','2026-01-14 08:39:39.070','WEEKLY',7,60,15);
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testquestion`
--

DROP TABLE IF EXISTS `testquestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testquestion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testId` int NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `correctAnswer` int NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `TestQuestion_testId_idx` (`testId`),
  CONSTRAINT `TestQuestion_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=832 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testquestion`
--

LOCK TABLES `testquestion` WRITE;
/*!40000 ALTER TABLE `testquestion` DISABLE KEYS */;
INSERT INTO `testquestion` VALUES (775,76,'Stateless Widget nima uchun ishlatiladi?','[\"State o\'zgarmayotgan UI uchun\",\"State o\'zgaradigan UI uchun\",\"Database uchun\",\"API uchun\"]',0,2,'2026-01-14 08:39:38.846'),(776,76,'Hot Reload nima qiladi?','[\"Ilovani to\'liq qayta yuklaydi\",\"Faqat o\'zgargan qismlarni yangilaydi\",\"Ma\'lumotlarni o\'chiradi\",\"State ni reset qiladi\"]',1,3,'2026-01-14 08:39:38.846'),(777,76,'Flutter nima?','[\"Google tomonidan yaratilgan UI framework\",\"Backend framework\",\"Database\",\"Programming language\"]',0,1,'2026-01-14 08:39:38.846'),(778,77,'State Management nima?','[\"Ma\'lumotlarni boshqarish usuli\",\"Database\",\"API\",\"Widget\"]',0,1,'2026-01-14 08:39:38.937'),(779,77,'Provider nima uchun ishlatiladi?','[\"State management uchun\",\"Database uchun\",\"Networking uchun\",\"UI uchun\"]',0,2,'2026-01-14 08:39:38.937'),(780,78,'Clean Architecture nimani nazarda tutadi?','[\"Kod strukturasini yaxshi tashkil qilish\",\"Kodni tozalash\",\"Bug\'larni tuzatish\",\"Test yozish\"]',0,1,'2026-01-14 08:39:38.963'),(781,78,'Repository Pattern nima?','[\"Ma\'lumotlar manbalarini abstraktsiya qilish\",\"Widget yaratish\",\"State management\",\"Animation\"]',0,2,'2026-01-14 08:39:38.963'),(782,79,'NestJS savol 10: NestJS interceptors qayerda ishlatiladi?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,10,'2026-01-14 08:39:39.079'),(783,79,'NestJS savol 8: NestJS pipes nimalar uchun ishlatiladi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"To\'g\'ri javob\"]',3,8,'2026-01-14 08:39:39.079'),(784,79,'NestJS savol 2: NestJS qaysi framework asosida qurilgan?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,2,'2026-01-14 08:39:39.079'),(785,79,'NestJS savol 6: NestJS module larda providers nima qiladi?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,6,'2026-01-14 08:39:39.079'),(786,79,'NestJS savol 1: NestJS nima?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,1,'2026-01-14 08:39:39.079'),(787,79,'NestJS savol 9: NestJS guards nima uchun kerak?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,9,'2026-01-14 08:39:39.079'),(788,79,'NestJS savol 4: NestJS service larda qaysi decorator ishlatiladi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"To\'g\'ri javob\"]',3,4,'2026-01-14 08:39:39.079'),(789,79,'NestJS savol 3: NestJS decorator lardan qaysi biri controller yaratadi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 4\"]',2,3,'2026-01-14 08:39:39.079'),(790,79,'NestJS savol 12: NestJS TypeORM nima?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"To\'g\'ri javob\"]',3,12,'2026-01-14 08:39:39.079'),(791,79,'NestJS savol 11: NestJS DTO nima?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 4\"]',2,11,'2026-01-14 08:39:39.079'),(792,79,'NestJS savol 5: NestJS dependency injection nimani ta\'minlaydi?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,5,'2026-01-14 08:39:39.079'),(793,79,'NestJS savol 13: NestJS Prisma nimaga kerak?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,13,'2026-01-14 08:39:39.079'),(794,79,'NestJS savol 7: NestJS middleware qachon ishlaydi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 4\"]',2,7,'2026-01-14 08:39:39.079'),(795,79,'NestJS savol 17: NestJS WebSocket qachon ishlatiladi?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,17,'2026-01-14 08:39:39.080'),(796,79,'NestJS savol 14: NestJS JWT nima?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,14,'2026-01-14 08:39:39.080'),(797,79,'NestJS savol 15: NestJS Passport nima qiladi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 4\"]',2,15,'2026-01-14 08:39:39.080'),(798,79,'NestJS savol 18: NestJS Microservices arxitekturasi nima?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,18,'2026-01-14 08:39:39.080'),(799,79,'NestJS savol 16: NestJS GraphQL qaysi transport protokol?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"To\'g\'ri javob\"]',3,16,'2026-01-14 08:39:39.080'),(800,79,'NestJS savol 20: NestJS ValidationPipe nima qiladi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"To\'g\'ri javob\"]',3,20,'2026-01-14 08:39:39.080'),(801,79,'NestJS savol 21: NestJS Exception filters qachon ishlatiladi?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,21,'2026-01-14 08:39:39.080'),(802,79,'NestJS savol 19: NestJS ConfigModule nima beradi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 4\"]',2,19,'2026-01-14 08:39:39.080'),(803,79,'NestJS savol 22: NestJS Logger service nimaga kerak?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,22,'2026-01-14 08:39:39.080'),(804,79,'NestJS savol 23: NestJS Testing da jest nima?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 4\"]',2,23,'2026-01-14 08:39:39.080'),(805,79,'NestJS savol 24: NestJS e2e testing nima?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"To\'g\'ri javob\"]',3,24,'2026-01-14 08:39:39.080'),(806,79,'NestJS savol 28: NestJS Caching qachon foydali?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"To\'g\'ri javob\"]',3,28,'2026-01-14 08:39:39.080'),(807,79,'NestJS savol 25: NestJS Swagger nima beradi?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,25,'2026-01-14 08:39:39.080'),(808,79,'NestJS savol 27: NestJS Rate limiting nimani oldini oladi?','[\"Noto\'g\'ri javob 1\",\"Noto\'g\'ri javob 2\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 4\"]',2,27,'2026-01-14 08:39:39.080'),(809,79,'NestJS savol 29: NestJS Queue lar nimaga kerak?','[\"To\'g\'ri javob\",\"Noto\'g\'ri javob 2\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',0,29,'2026-01-14 08:39:39.080'),(810,79,'NestJS savol 30: NestJS Production deployment da nima muhim?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,30,'2026-01-14 08:39:39.080'),(811,79,'NestJS savol 26: NestJS CORS nima?','[\"Noto\'g\'ri javob 1\",\"To\'g\'ri javob\",\"Noto\'g\'ri javob 3\",\"Noto\'g\'ri javob 4\"]',1,26,'2026-01-14 08:39:39.080'),(812,80,'NestJS o\'rta savol 7: Serialization nima qiladi?','[\"Xato javob 1\",\"Xato javob 2\",\"To\'g\'ri javob varianti\",\"Xato javob 4\"]',2,7,'2026-01-14 08:39:39.120'),(813,80,'NestJS o\'rta savol 6: Error handling eng yaxshi usuli?','[\"Xato javob 1\",\"To\'g\'ri javob varianti\",\"Xato javob 3\",\"Xato javob 4\"]',1,6,'2026-01-14 08:39:39.120'),(814,80,'NestJS o\'rta savol 5: Database transaction nimaga kerak?','[\"To\'g\'ri javob varianti\",\"Xato javob 2\",\"Xato javob 3\",\"Xato javob 4\"]',0,5,'2026-01-14 08:39:39.120'),(815,80,'NestJS o\'rta savol 3: Request lifecycle qanday ishlaydi?','[\"Xato javob 1\",\"Xato javob 2\",\"To\'g\'ri javob varianti\",\"Xato javob 4\"]',2,3,'2026-01-14 08:39:39.120'),(816,80,'NestJS o\'rta savol 8: Request validation qanday qilinadi?','[\"Xato javob 1\",\"Xato javob 2\",\"Xato javob 3\",\"To\'g\'ri javob varianti\"]',3,8,'2026-01-14 08:39:39.120'),(817,80,'NestJS o\'rta savol 4: Custom decorator qanday yaratiladi?','[\"Xato javob 1\",\"Xato javob 2\",\"Xato javob 3\",\"To\'g\'ri javob varianti\"]',3,4,'2026-01-14 08:39:39.120'),(818,80,'NestJS o\'rta savol 2: Async/await nima uchun kerak?','[\"Xato javob 1\",\"To\'g\'ri javob varianti\",\"Xato javob 3\",\"Xato javob 4\"]',1,2,'2026-01-14 08:39:39.120'),(819,80,'NestJS o\'rta savol 9: File upload qanday qabul qilinadi?','[\"To\'g\'ri javob varianti\",\"Xato javob 2\",\"Xato javob 3\",\"Xato javob 4\"]',0,9,'2026-01-14 08:39:39.120'),(820,80,'NestJS o\'rta savol 1: Controller decorator parametrlari nimani belgilaydi?','[\"To\'g\'ri javob varianti\",\"Xato javob 2\",\"Xato javob 3\",\"Xato javob 4\"]',0,1,'2026-01-14 08:39:39.120'),(821,80,'NestJS o\'rta savol 11: Custom pipes qanday yaratiladi?','[\"Xato javob 1\",\"Xato javob 2\",\"To\'g\'ri javob varianti\",\"Xato javob 4\"]',2,11,'2026-01-14 08:39:39.123'),(822,80,'NestJS o\'rta savol 10: Response transformation nima?','[\"Xato javob 1\",\"To\'g\'ri javob varianti\",\"Xato javob 3\",\"Xato javob 4\"]',1,10,'2026-01-14 08:39:39.123'),(823,80,'NestJS o\'rta savol 15: Custom repository pattern?','[\"Xato javob 1\",\"Xato javob 2\",\"To\'g\'ri javob varianti\",\"Xato javob 4\"]',2,15,'2026-01-14 08:39:39.123'),(824,80,'NestJS o\'rta savol 13: Authentication strategy nima?','[\"To\'g\'ri javob varianti\",\"Xato javob 2\",\"Xato javob 3\",\"Xato javob 4\"]',0,13,'2026-01-14 08:39:39.123'),(825,80,'NestJS o\'rta savol 17: Schedule tasks qanday?','[\"To\'g\'ri javob varianti\",\"Xato javob 2\",\"Xato javob 3\",\"Xato javob 4\"]',0,17,'2026-01-14 08:39:39.123'),(826,80,'NestJS o\'rta savol 14: Authorization guard qanday ishlaydi?','[\"Xato javob 1\",\"To\'g\'ri javob varianti\",\"Xato javob 3\",\"Xato javob 4\"]',1,14,'2026-01-14 08:39:39.123'),(827,80,'NestJS o\'rta savol 16: Event emitter nima uchun?','[\"Xato javob 1\",\"Xato javob 2\",\"Xato javob 3\",\"To\'g\'ri javob varianti\"]',3,16,'2026-01-14 08:39:39.123'),(828,80,'NestJS o\'rta savol 12: Global middleware qanday qo\'shiladi?','[\"Xato javob 1\",\"Xato javob 2\",\"Xato javob 3\",\"To\'g\'ri javob varianti\"]',3,12,'2026-01-14 08:39:39.123'),(829,80,'NestJS o\'rta savol 18: Health checks nimaga kerak?','[\"Xato javob 1\",\"To\'g\'ri javob varianti\",\"Xato javob 3\",\"Xato javob 4\"]',1,18,'2026-01-14 08:39:39.123'),(830,80,'NestJS o\'rta savol 20: Circular dependency muammosi?','[\"Xato javob 1\",\"Xato javob 2\",\"Xato javob 3\",\"To\'g\'ri javob varianti\"]',3,20,'2026-01-14 08:39:39.123'),(831,80,'NestJS o\'rta savol 19: Dynamic modules nima?','[\"Xato javob 1\",\"Xato javob 2\",\"To\'g\'ri javob varianti\",\"Xato javob 4\"]',2,19,'2026-01-14 08:39:39.123');
/*!40000 ALTER TABLE `testquestion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testresult`
--

DROP TABLE IF EXISTS `testresult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testresult` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `testId` int NOT NULL,
  `score` int NOT NULL,
  `answers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isPassed` tinyint(1) NOT NULL DEFAULT '0',
  `completedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `correctAnswers` int NOT NULL,
  `totalQuestions` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TestResult_userId_idx` (`userId`),
  KEY `TestResult_testId_idx` (`testId`),
  CONSTRAINT `TestResult_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TestResult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testresult`
--

LOCK TABLES `testresult` WRITE;
/*!40000 ALTER TABLE `testresult` DISABLE KEYS */;
INSERT INTO `testresult` VALUES (7,171,76,100,'[{\"questionId\":775,\"selectedAnswer\":0,\"correctAnswer\":0},{\"questionId\":776,\"selectedAnswer\":1,\"correctAnswer\":1},{\"questionId\":777,\"selectedAnswer\":0,\"correctAnswer\":0}]',1,'2026-01-14 09:41:28.921',3,3);
/*!40000 ALTER TABLE `testresult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testsession`
--

DROP TABLE IF EXISTS `testsession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testsession` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `testId` int NOT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expiresAt` datetime(3) NOT NULL,
  `submittedAt` datetime(3) DEFAULT NULL,
  `isExpired` tinyint(1) NOT NULL DEFAULT '0',
  `isSubmitted` tinyint(1) NOT NULL DEFAULT '0',
  `currentAnswers` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TestSession_userId_idx` (`userId`),
  KEY `TestSession_testId_idx` (`testId`),
  KEY `TestSession_isExpired_idx` (`isExpired`),
  CONSTRAINT `TestSession_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TestSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsession`
--

LOCK TABLES `testsession` WRITE;
/*!40000 ALTER TABLE `testsession` DISABLE KEYS */;
INSERT INTO `testsession` VALUES (8,171,76,'2026-01-14 09:41:17.589','2026-01-14 10:41:17.588','2026-01-14 09:41:28.916',0,1,'{\"775\":0,\"776\":1,\"777\":0}');
/*!40000 ALTER TABLE `testsession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testsessionanswer`
--

DROP TABLE IF EXISTS `testsessionanswer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testsessionanswer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionId` int NOT NULL,
  `questionId` int NOT NULL,
  `selectedAnswer` int NOT NULL,
  `answeredAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `TestSessionAnswer_sessionId_questionId_key` (`sessionId`,`questionId`),
  KEY `TestSessionAnswer_sessionId_idx` (`sessionId`),
  KEY `TestSessionAnswer_questionId_idx` (`questionId`),
  CONSTRAINT `TestSessionAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `testquestion` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `TestSessionAnswer_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `testsession` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testsessionanswer`
--

LOCK TABLES `testsessionanswer` WRITE;
/*!40000 ALTER TABLE `testsessionanswer` DISABLE KEYS */;
INSERT INTO `testsessionanswer` VALUES (94,8,777,0,'2026-01-14 09:41:23.362'),(95,8,775,0,'2026-01-14 09:41:25.590'),(96,8,776,1,'2026-01-14 09:41:27.314');
/*!40000 ALTER TABLE `testsessionanswer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('MALE','FEMALE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` enum('TOSHKENT_SHAHAR','TOSHKENT_VILOYATI','ANDIJON','BUXORO','FARGONA','JIZZAX','XORAZM','NAMANGAN','NAVOIY','QASHQADARYO','QORAQALPOGISTON','SAMARQAND','SIRDARYO','SURXONDARYO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_phone_key` (`phone`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_phone_idx` (`phone`),
  KEY `User_email_idx` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (170,'+998901234560','test@example.com','Test','User','https://i.pravatar.cc/300?img=68','MALE','TOSHKENT_SHAHAR',1,1,'2026-01-14 08:39:39.172','2026-01-14 08:39:39.466',550000.00),(171,'+998950642827','khurshidi2827@gmail.com','Xurshid ','Ismoilov ','/uploads/images/1768383738299-scaled_1000011244.jpg','MALE','BUXORO',1,1,'2026-01-14 08:45:49.044','2026-01-14 12:21:53.972',470000.00);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificationcode`
--

DROP TABLE IF EXISTS `verificationcode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificationcode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `isUsed` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `VerificationCode_userId_idx` (`userId`),
  KEY `VerificationCode_code_idx` (`code`),
  CONSTRAINT `VerificationCode_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificationcode`
--

LOCK TABLES `verificationcode` WRITE;
/*!40000 ALTER TABLE `verificationcode` DISABLE KEYS */;
INSERT INTO `verificationcode` VALUES (23,171,'666666','2026-01-14 12:23:50.150',1,'2026-01-14 12:21:50.153');
/*!40000 ALTER TABLE `verificationcode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseId` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `isFree` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `screenshots` text COLLATE utf8mb4_unicode_ci,
  `sectionId` int DEFAULT NULL,
  `size` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Video_courseId_idx` (`courseId`),
  KEY `Video_order_idx` (`order`),
  KEY `Video_sectionId_idx` (`sectionId`),
  CONSTRAINT `Video_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Video_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video`
--

LOCK TABLES `video` WRITE;
/*!40000 ALTER TABLE `video` DISABLE KEYS */;
INSERT INTO `video` VALUES (235,61,'Birinchi Flutter ilovasi',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4','/uploads/course/1768379975966-uegcoq.jpg',540,3,0,1,'2026-01-14 08:39:37.925','2026-01-14 08:39:37.925','Hello World ilovasi yaratish va ishga tushirish',NULL,111,9437184),(236,61,'Flutter o\'rnatish',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4','/uploads/course/1768379975965-h6ysl.jpg',420,2,1,1,'2026-01-14 08:39:37.925','2026-01-14 08:39:37.925','Flutter SDK ni kompyuterga o\'rnatish va sozlash','[\"https://picsum.photos/seed/s3/800/600\"]',111,7340032),(237,61,'Kursga xush kelibsiz',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4','/uploads/course/1768379975964-jy3o5o.jpg',360,1,1,1,'2026-01-14 08:39:37.925','2026-01-14 08:39:37.925','Kursda nimalarni o\'rganishimiz va kurs haqida to\'liq ma\'lumot','[\"https://picsum.photos/seed/s1/800/600\",\"https://picsum.photos/seed/s2/800/600\"]',111,5510872),(238,61,'Stateless va Stateful Widgetlar',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4','/uploads/course/1768379975968-2s2ns.jpg',720,1,0,1,'2026-01-14 08:39:38.073','2026-01-14 08:39:38.073','Widget turlari va ularning farqlari','[\"https://picsum.photos/seed/s4/800/600\",\"https://picsum.photos/seed/s5/800/600\",\"https://picsum.photos/seed/s6/800/600\"]',112,12582912),(239,61,'Layout Widgetlari',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4','/uploads/course/1768379975969-6yhsx.jpg',680,2,0,1,'2026-01-14 08:39:38.073','2026-01-14 08:39:38.073','Row, Column, Stack va boshqa layout widgetlar',NULL,112,NULL),(240,63,'Asosiy tushunchalar',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4','/uploads/course/1768379975961-3iujjf.jpg',30,2,0,1,'2026-01-14 08:39:39.144','2026-01-14 08:39:39.144',NULL,NULL,113,NULL),(241,63,'Kirish',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4','/uploads/course/1768379975961-3iujjf.jpg',30,1,1,1,'2026-01-14 08:39:39.144','2026-01-14 08:39:39.144',NULL,NULL,113,NULL),(242,65,'Asosiy tushunchalar',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4','/uploads/course/1768379975961-k7vqfq.jpg',30,2,0,1,'2026-01-14 08:39:39.151','2026-01-14 08:39:39.151',NULL,NULL,114,NULL),(243,65,'Kirish',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4','/uploads/course/1768379975961-k7vqfq.jpg',30,1,1,1,'2026-01-14 08:39:39.151','2026-01-14 08:39:39.151',NULL,NULL,114,NULL),(244,64,'Kirish',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4','/uploads/course/1768379975962-7odog.jpg',30,1,1,1,'2026-01-14 08:39:39.159','2026-01-14 08:39:39.159',NULL,NULL,115,NULL),(245,64,'Asosiy tushunchalar',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4','/uploads/course/1768379975962-7odog.jpg',30,2,0,1,'2026-01-14 08:39:39.159','2026-01-14 08:39:39.159',NULL,NULL,115,NULL),(246,62,'Asosiy tushunchalar',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4','/uploads/course/1768379975963-ctz2qj.jpg',30,2,0,1,'2026-01-14 08:39:39.165','2026-01-14 08:39:39.165',NULL,NULL,116,NULL),(247,62,'Kirish',NULL,'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4','/uploads/course/1768379975963-ctz2qj.jpg',30,1,1,1,'2026-01-14 08:39:39.165','2026-01-14 08:39:39.165',NULL,NULL,116,NULL);
/*!40000 ALTER TABLE `video` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-22 19:42:03
