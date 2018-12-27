-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: auth
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('module','page','fn') NOT NULL,
  `key` varchar(255) NOT NULL,
  `sequence` int(11) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `routepath` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `pid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜单';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'用户管理','page','user',0,'','/user','','2018-12-26 09:34:47','2018-12-26 09:34:47',NULL),(2,'角色管理','page','role',0,'','/role','','2018-12-26 09:35:02','2018-12-26 09:35:02',NULL),(3,'菜单管理','page','menu',0,'','/menu','','2018-12-26 09:35:15','2018-12-26 09:35:15',NULL),(4,'添加或编辑用户','fn','edit',0,'','','','2018-12-26 09:54:32','2018-12-26 09:54:32',1),(5,'删除用户','fn','delete',0,'','','','2018-12-26 09:54:44','2018-12-26 09:54:44',1),(6,'设置权限','fn','setauth',0,'','/role-add-auth/:id/:name','','2018-12-26 09:56:08','2018-12-27 02:36:19',2),(8,'设置用户','fn','setuser',0,'','','','2018-12-27 02:36:14','2018-12-27 02:36:14',2),(9,'添加或编辑角色','fn','edit',0,'','','','2018-12-27 02:36:48','2018-12-27 02:36:48',2),(10,'删除角色','fn','delete',0,'','','','2018-12-27 02:37:03','2018-12-27 02:37:03',2),(11,'添加或编辑资源项','fn','edit',0,'','','','2018-12-27 02:37:28','2018-12-27 02:37:28',3),(12,'删除资源项','fn','delete',0,'','','','2018-12-27 02:37:45','2018-12-27 02:37:45',3);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'super','2018-12-26 09:34:25','2018-12-26 09:34:25'),(2,'test','2018-12-27 02:55:13','2018-12-27 02:55:13');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_menu_mapping`
--

DROP TABLE IF EXISTS `role_menu_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `role_menu_mapping` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `menuId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`menuId`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `role_menu_mapping_ibfk_1` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_menu_mapping_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜单';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_menu_mapping`
--

LOCK TABLES `role_menu_mapping` WRITE;
/*!40000 ALTER TABLE `role_menu_mapping` DISABLE KEYS */;
INSERT INTO `role_menu_mapping` VALUES ('2018-12-26 09:35:22','2018-12-26 09:35:22',1,1),('2018-12-27 02:55:46','2018-12-27 02:55:46',1,2),('2018-12-26 09:35:22','2018-12-26 09:35:22',2,1),('2018-12-27 02:55:46','2018-12-27 02:55:46',2,2),('2018-12-26 09:35:22','2018-12-26 09:35:22',3,1),('2018-12-27 02:55:46','2018-12-27 02:55:46',3,2),('2018-12-26 09:58:05','2018-12-26 09:58:05',4,1),('2018-12-27 02:55:46','2018-12-27 02:55:46',4,2),('2018-12-27 02:33:58','2018-12-27 02:33:58',5,1),('2018-12-26 09:58:05','2018-12-26 09:58:05',6,1),('2018-12-27 02:54:35','2018-12-27 02:54:35',8,1),('2018-12-27 02:54:35','2018-12-27 02:54:35',9,1),('2018-12-27 02:55:46','2018-12-27 02:55:46',9,2),('2018-12-27 02:54:35','2018-12-27 02:54:35',10,1),('2018-12-27 02:55:46','2018-12-27 02:55:46',10,2),('2018-12-27 02:54:35','2018-12-27 02:54:35',11,1),('2018-12-27 02:54:35','2018-12-27 02:54:35',12,1);
/*!40000 ALTER TABLE `role_menu_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_user_mapping`
--

DROP TABLE IF EXISTS `role_user_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `role_user_mapping` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `role_user_mapping_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_user_mapping_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_user_mapping`
--

LOCK TABLES `role_user_mapping` WRITE;
/*!40000 ALTER TABLE `role_user_mapping` DISABLE KEYS */;
INSERT INTO `role_user_mapping` VALUES ('2018-12-26 09:39:15','2018-12-26 09:39:15',1,1),('2018-12-26 10:26:01','2018-12-26 10:26:01',1,3),('2018-12-27 02:55:52','2018-12-27 02:55:52',2,4);
/*!40000 ALTER TABLE `role_user_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `realname` varchar(255) DEFAULT '',
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'fanfan','e10adc3949ba59abbe56e057f20f883e','',NULL,'',NULL,NULL,1,'2018-12-26 09:34:16','2018-12-27 02:33:50',NULL),(2,'fanfan2','e10adc3949ba59abbe56e057f20f883e','',NULL,'',NULL,NULL,1,'2018-12-26 09:42:39','2018-12-26 09:42:43','2018-12-27 02:34:09'),(3,'super','e10adc3949ba59abbe56e057f20f883e','',NULL,'',NULL,NULL,1,'2018-12-26 10:25:42','2018-12-27 02:33:48',NULL),(4,'test','e10adc3949ba59abbe56e057f20f883e','',NULL,'',NULL,NULL,1,'2018-12-27 02:55:19','2018-12-27 02:55:23',NULL);
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

-- Dump completed on 2018-12-27 15:53:59
