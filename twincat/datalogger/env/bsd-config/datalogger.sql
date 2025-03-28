-- --------------------------------------------------------
-- Host:                         192.168.21.34
-- Versione server:              10.11.6-MariaDB-0+deb12u1 - Debian 12
-- S.O. server:                  debian-linux-gnu
-- HeidiSQL Versione:            12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dump della struttura del database datalogger
CREATE DATABASE IF NOT EXISTS `datalogger` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `datalogger`;

-- Dump della struttura di tabella datalogger.association_asset_alarm
CREATE TABLE IF NOT EXISTS `association_asset_alarm` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `assetId` bigint(20) unsigned NOT NULL,
  `alarmId` bigint(20) unsigned NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `assetId_alarmId` (`assetId`,`alarmId`),
  KEY `fk_asset_association_alarm` (`assetId`),
  KEY `fk_alarm_association_asset` (`alarmId`),
  CONSTRAINT `fk_alarm_association_asset` FOREIGN KEY (`alarmId`) REFERENCES `configuration_alarms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_asset_association_alarm` FOREIGN KEY (`assetId`) REFERENCES `device` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.association_asset_alarm: ~0 rows (circa)
DELETE FROM `association_asset_alarm`;

-- Dump della struttura di tabella datalogger.bitmask
CREATE TABLE IF NOT EXISTS `bitmask` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `device_type_data_structure_id` bigint(20) unsigned NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `bit` enum('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31') NOT NULL DEFAULT '0',
  `type` enum('Fault','Information','Service','Warning') NOT NULL DEFAULT 'Information',
  `priority` int(11) NOT NULL DEFAULT 1000,
  `onValue` enum('0','1') NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_bit` (`device_type_data_structure_id`,`bit`) USING BTREE,
  KEY `FK_bitmask_devicetype_data_structure` (`device_type_data_structure_id`),
  CONSTRAINT `FK_bitmask_devicetype_data_structure` FOREIGN KEY (`device_type_data_structure_id`) REFERENCES `devicetype_data_structure` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=1299 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.bitmask: ~16 rows (circa)
DELETE FROM `bitmask`;
INSERT INTO `bitmask` (`id`, `device_type_data_structure_id`, `description`, `bit`, `type`, `priority`, `onValue`) VALUES
	(1219, 13414, 'v0', '0', 'Information', 1000, '1'),
	(1220, 13414, 'v1', '1', 'Information', 1000, '1'),
	(1221, 13414, 'v2', '2', 'Information', 1000, '1'),
	(1222, 13414, 'v3', '3', 'Information', 1000, '1'),
	(1223, 13414, 'v4', '4', 'Information', 1000, '1'),
	(1224, 13414, 'v5', '5', 'Information', 1000, '1'),
	(1225, 13414, 'v6', '6', 'Information', 1000, '1'),
	(1226, 13414, 'v7', '7', 'Information', 1000, '1'),
	(1227, 13414, 'v8', '8', 'Information', 1000, '1'),
	(1228, 13414, 'v9', '9', 'Information', 1000, '1'),
	(1229, 13414, 'v10', '10', 'Information', 1000, '1'),
	(1230, 13414, 'v11', '11', 'Information', 1000, '1'),
	(1231, 13414, 'v12', '12', 'Information', 1000, '1'),
	(1232, 13414, 'v13', '13', 'Information', 1000, '1'),
	(1233, 13414, 'v14', '14', 'Information', 1000, '1'),
	(1234, 13414, 'v15', '15', 'Information', 1000, '1');

-- Dump della struttura di tabella datalogger.configuration_alarms
CREATE TABLE IF NOT EXISTS `configuration_alarms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `condition` text NOT NULL,
  `active_time` int(11) DEFAULT NULL,
  `deactive_time` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `severity` int(11) NOT NULL,
  `deleted` enum('0','1') NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.configuration_alarms: ~1 rows (circa)
DELETE FROM `configuration_alarms`;
INSERT INTO `configuration_alarms` (`id`, `name`, `condition`, `active_time`, `deactive_time`, `message`, `severity`, `deleted`, `createdAt`, `updateAt`) VALUES
	(15, 'Inverter Production', '{"$and":[{"assetCategory":2,"#.Active power":{"$gte":"300"}}]}', 1, 1, 'The inverter is not producing', 1, '0', '2025-02-09 14:27:34', '2025-03-25 11:06:53');

-- Dump della struttura di tabella datalogger.datalogger_configuration
CREATE TABLE IF NOT EXISTS `datalogger_configuration` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `dataloggerId` bigint(20) unsigned NOT NULL,
  `userId` bigint(20) unsigned NOT NULL,
  `configuration` longtext NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella datalogger.datalogger_configuration: ~0 rows (circa)
DELETE FROM `datalogger_configuration`;

-- Dump della struttura di tabella datalogger.data_logger
CREATE TABLE IF NOT EXISTS `data_logger` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `host` varchar(255) NOT NULL DEFAULT '',
  `location` text DEFAULT NULL,
  `description` varchar(50) DEFAULT '',
  `enabled` enum('0','1') DEFAULT '1',
  `deleted` enum('0','1') NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=179 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.data_logger: ~1 rows (circa)
DELETE FROM `data_logger`;
INSERT INTO `data_logger` (`id`, `name`, `host`, `location`, `description`, `enabled`, `deleted`, `createdAt`, `updateAt`) VALUES
	(1, 'Datalogger #1', '192.168.1.456', NULL, '', '1', '0', '2025-03-13 12:46:07', '2025-03-25 11:06:52');

-- Dump della struttura di tabella datalogger.device
CREATE TABLE IF NOT EXISTS `device` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `dataLoggerId` bigint(20) unsigned NOT NULL DEFAULT 1,
  `deviceTypeId` bigint(20) unsigned NOT NULL DEFAULT 0,
  `device_type_test` enum('Inverter','Meter') DEFAULT NULL,
  `enabled` enum('0','1') NOT NULL DEFAULT '1',
  `description` varchar(255) DEFAULT NULL,
  `deleted` enum('0','1') NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_device_device_type` (`deviceTypeId`),
  KEY `FK_device_cpu` (`dataLoggerId`) USING BTREE,
  CONSTRAINT `FK_device_data_logger` FOREIGN KEY (`dataLoggerId`) REFERENCES `data_logger` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_device_device_type` FOREIGN KEY (`deviceTypeId`) REFERENCES `device_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella datalogger.device: ~2 rows (circa)
DELETE FROM `device`;
INSERT INTO `device` (`id`, `name`, `dataLoggerId`, `deviceTypeId`, `device_type_test`, `enabled`, `description`, `deleted`, `createdAt`, `updateAt`) VALUES
	(1, 'Inverter_1', 1, 2, NULL, '1', 'Huawei_330_Inverter', '0', '2024-11-07 13:25:09', '2025-03-26 15:07:14'),
	(6, 'Piranometro', 1, 10, NULL, '1', NULL, '0', '2024-11-14 12:07:33', '2025-03-25 11:06:53');

-- Dump della struttura di tabella datalogger.devicetype_data_structure
CREATE TABLE IF NOT EXISTS `devicetype_data_structure` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `deviceTypeId` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `signalType` enum('measure','bitmask','enumeration','digital') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'measure',
  `signalMode` enum('pooling','onchange') DEFAULT NULL,
  `modbusFunction` enum('1','2','3','4','5','6','7','8','11','12','15','16','17','20','21','22','23','24','43') NOT NULL,
  `modbusAddress` int(10) unsigned NOT NULL,
  `modbusType` enum('BIT','INT16','UINT16','INT32','UINT32','FLOAT32','DOUBLE64') NOT NULL DEFAULT 'INT16',
  `modbusAccess` enum('R','W','RW') NOT NULL DEFAULT 'RW',
  `measureUnit` varchar(50) DEFAULT NULL,
  `gain` double NOT NULL DEFAULT 1 COMMENT 'scale factor',
  `diff` double NOT NULL DEFAULT 0 COMMENT 'offset subtraction',
  `postFunction` longtext DEFAULT NULL,
  `showOnGraphic` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_devicetype_data_structure_device_type` (`deviceTypeId`),
  CONSTRAINT `FK_devicetype_data_structure_device_type` FOREIGN KEY (`deviceTypeId`) REFERENCES `device_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13466 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella datalogger.devicetype_data_structure: ~14 rows (circa)
DELETE FROM `devicetype_data_structure`;
INSERT INTO `devicetype_data_structure` (`id`, `deviceTypeId`, `name`, `description`, `signalType`, `signalMode`, `modbusFunction`, `modbusAddress`, `modbusType`, `modbusAccess`, `measureUnit`, `gain`, `diff`, `postFunction`, `showOnGraphic`, `createdAt`, `updateAt`) VALUES
	(13392, 2, 'signal #0', 'Offset second', 'measure', NULL, '3', 0, 'INT32', 'R', '', 1, 0, 'Test', 1, '2025-03-25 11:06:52', '2025-03-26 15:12:23'),
	(13393, 2, 'signal #1', '0: The DST is not started. 1: start the DST', 'measure', NULL, '3', 2, 'UINT16', 'R', '', 1, 0, NULL, 1, '2025-03-25 11:06:52', '2025-03-26 15:12:37'),
	(13394, 2, 'signal #2', 'Epoch second, local time of', 'measure', NULL, '3', 5, 'UINT32', 'R', '', 1, 0, NULL, 0, '2025-03-25 11:06:52', '2025-03-26 15:12:38'),
	(13404, 10, 'signal #0', NULL, 'measure', NULL, '1', 0, 'UINT16', 'R', '', 1, 0, NULL, 1, '2025-03-25 11:06:53', NULL),
	(13405, 10, 'signal #1', NULL, 'enumeration', NULL, '2', 0, 'INT16', 'R', '', 1, 0, NULL, 1, '2025-03-25 11:06:53', '2025-03-26 15:13:55'),
	(13406, 10, 'signal #2', NULL, 'measure', NULL, '2', 1, 'UINT16', 'R', '', 1, 0, NULL, 1, '2025-03-25 11:06:53', NULL),
	(13407, 10, 'signal #3', NULL, 'measure', NULL, '3', 0, 'INT16', 'R', '', 0.001, 0, NULL, 1, '2025-03-25 11:06:53', NULL),
	(13408, 10, 'signal #4', NULL, 'measure', NULL, '3', 1, 'UINT16', 'R', '', 1, 0, 'return value', 1, '2025-03-25 11:06:53', NULL),
	(13409, 10, 'signal #5', NULL, 'measure', NULL, '3', 2, 'UINT16', 'R', '', 1, 0, NULL, 1, '2025-03-25 11:06:53', NULL),
	(13410, 10, 'signal #6', NULL, 'measure', NULL, '3', 3, 'UINT16', 'R', '', 1, 0, NULL, 1, '2025-03-25 11:06:53', NULL),
	(13411, 10, 'signal #7', NULL, 'measure', NULL, '3', 4, 'UINT16', 'R', '', 0.001, 0, NULL, 1, '2025-03-25 11:06:53', NULL),
	(13412, 10, 'signal #8', NULL, 'measure', NULL, '3', 8, 'UINT16', 'R', '', 0.1, 2, NULL, 1, '2025-03-25 11:06:53', NULL),
	(13413, 10, 'signal #9', NULL, 'measure', NULL, '3', 9, 'UINT16', 'R', '', 1, 0, '', 1, '2025-03-25 11:06:53', NULL),
	(13414, 10, 'signal #10', NULL, 'bitmask', NULL, '3', 10, 'UINT16', 'R', '', 1, 0, 'return value', 1, '2025-03-25 11:06:53', '2025-03-26 15:13:44');

-- Dump della struttura di tabella datalogger.device_interface
CREATE TABLE IF NOT EXISTS `device_interface` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '0',
  `host` varchar(128) NOT NULL DEFAULT '0',
  `port` int(11) NOT NULL DEFAULT 0,
  `deleted` enum('0','1') DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=687 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.device_interface: ~1 rows (circa)
DELETE FROM `device_interface`;
INSERT INTO `device_interface` (`id`, `name`, `host`, `port`, `deleted`, `createdAt`, `updateAt`) VALUES
	(36, 'MGATE_1', '192.168.21.16', 8502, '0', '2025-03-13 13:02:30', '2025-03-26 15:08:56');

-- Dump della struttura di tabella datalogger.device_type
CREATE TABLE IF NOT EXISTS `device_type` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `model` varchar(128) NOT NULL,
  `manufacturer` varchar(128) DEFAULT NULL,
  `firmwareRev` varchar(128) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `deleted` enum('0','1') NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella datalogger.device_type: ~2 rows (circa)
DELETE FROM `device_type`;
INSERT INTO `device_type` (`id`, `model`, `manufacturer`, `firmwareRev`, `description`, `deleted`, `createdAt`, `updateAt`) VALUES
	(2, 'Huawei_330', 'Huawei', NULL, 'Inverter', '0', '2024-11-07 11:47:15', '2025-03-25 11:06:52'),
	(10, 'SMP10', 'KIPP & ZONEN', 'rev 1', NULL, '0', '2024-11-14 12:05:53', '2025-03-26 15:07:24');

-- Dump della struttura di tabella datalogger.digital
CREATE TABLE IF NOT EXISTS `digital` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `device_type_data_structure_id` bigint(20) unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `value` bit(1) NOT NULL DEFAULT b'0',
  `type` enum('Fault','Information','Service','Warning') NOT NULL DEFAULT 'Information',
  `priority` int(11) NOT NULL DEFAULT 1000,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_device_value` (`device_type_data_structure_id`,`value`) USING BTREE,
  KEY `FK_digital_devicetype_data_structure` (`device_type_data_structure_id`),
  CONSTRAINT `FK_digital_devicetype_data_structure` FOREIGN KEY (`device_type_data_structure_id`) REFERENCES `devicetype_data_structure` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella datalogger.digital: ~0 rows (circa)
DELETE FROM `digital`;

-- Dump della struttura di tabella datalogger.enumeration
CREATE TABLE IF NOT EXISTS `enumeration` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `device_type_data_structure_id` bigint(20) unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `value` int(11) NOT NULL,
  `type` enum('Fault','Information','Service','Warning') NOT NULL DEFAULT 'Information',
  `priority` int(11) NOT NULL DEFAULT 1000,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_value` (`device_type_data_structure_id`,`value`),
  KEY `FK_enumeration_devicetype_data_structure` (`device_type_data_structure_id`) USING BTREE,
  CONSTRAINT `FK_enumeration_devicetype_data_structure` FOREIGN KEY (`device_type_data_structure_id`) REFERENCES `devicetype_data_structure` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.enumeration: ~3 rows (circa)
DELETE FROM `enumeration`;
INSERT INTO `enumeration` (`id`, `device_type_data_structure_id`, `description`, `value`, `type`, `priority`) VALUES
	(72, 13405, 'v0', 0, 'Information', 1000),
	(73, 13405, 'v1', 1, 'Information', 1000),
	(74, 13405, 'v2', 2, 'Information', 1000);

-- Dump della struttura di tabella datalogger.historical_download
CREATE TABLE IF NOT EXISTS `historical_download` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `payload` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.historical_download: ~0 rows (circa)
DELETE FROM `historical_download`;

-- Dump della struttura di tabella datalogger.knex_migrations
CREATE TABLE IF NOT EXISTS `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella datalogger.knex_migrations: ~17 rows (circa)
DELETE FROM `knex_migrations`;
INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
	(33, '20241225082000.js', 1, '2025-01-15 08:54:09'),
	(34, '20241230800000.js', 2, '2025-01-15 08:59:52'),
	(35, '20250102160000.js', 2, '2025-01-15 08:59:52'),
	(37, '20250102173000.js', 2, '2025-01-15 08:59:52'),
	(55, '20250115151200.js', 4, '2025-01-15 16:30:49'),
	(62, '20240102115000_alarms.js', 5, '2025-01-24 10:20:30'),
	(63, '20241205090200_add_historical_download.js', 5, '2025-01-24 10:20:30'),
	(64, '20241209115000_configuration_alarms.js', 5, '2025-01-24 10:20:30'),
	(65, '20241218101000_association_asset_alarm.js', 5, '2025-01-24 10:20:30'),
	(70, '20250129103000.js', 6, '2025-01-29 09:43:11'),
	(71, '20250129104000.js', 6, '2025-01-29 09:43:11'),
	(77, '20250102170000.js', 7, '2025-01-29 09:56:29'),
	(82, '20250129110000.js', 8, '2025-01-29 10:12:21'),
	(83, '20250124103500.js', 9, '2025-02-12 09:39:58'),
	(89, '20250227141600.js', 10, '2025-03-11 08:36:57'),
	(90, '20250303110000.js', 10, '2025-03-11 08:36:57'),
	(95, '20250311110000.js', 11, '2025-03-11 14:01:18');

-- Dump della struttura di tabella datalogger.knex_migrations_lock
CREATE TABLE IF NOT EXISTS `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dump dei dati della tabella datalogger.knex_migrations_lock: ~1 rows (circa)
DELETE FROM `knex_migrations_lock`;
INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
	(1, 0);

-- Dump della struttura di tabella datalogger.logs
CREATE TABLE IF NOT EXISTS `logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` bigint(20) unsigned NOT NULL DEFAULT 0,
  `entity` varchar(255) NOT NULL DEFAULT '0',
  `entityId` bigint(20) unsigned NOT NULL DEFAULT 0,
  `operation` varchar(50) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  PRIMARY KEY (`id`),
  KEY `FK_logs_user` (`userId`),
  CONSTRAINT `FK_logs_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2426 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.logs: ~0 rows (circa)
DELETE FROM `logs`;

-- Dump della struttura di tabella datalogger.rel_device_interfaces
CREATE TABLE IF NOT EXISTS `rel_device_interfaces` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `deviceId` bigint(20) unsigned NOT NULL DEFAULT 0,
  `interfaceId` bigint(20) unsigned DEFAULT 0,
  `protocol` enum('TCP','RTU','RTUoverTCP') NOT NULL DEFAULT 'TCP',
  `pollingPeriod` int(10) unsigned NOT NULL DEFAULT 3000,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `deviceId` (`deviceId`),
  KEY `FK_rel_device_interfaces_device_interface` (`interfaceId`),
  CONSTRAINT `FK_rel_device_interfaces_device` FOREIGN KEY (`deviceId`) REFERENCES `device` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_rel_device_interfaces_device_interface` FOREIGN KEY (`interfaceId`) REFERENCES `device_interface` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1034 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.rel_device_interfaces: ~2 rows (circa)
DELETE FROM `rel_device_interfaces`;
INSERT INTO `rel_device_interfaces` (`id`, `deviceId`, `interfaceId`, `protocol`, `pollingPeriod`, `config`, `createdAt`, `updateAt`) VALUES
	(1026, 6, 36, 'TCP', 6000, '{"unitId":"1","byteOrder":"BE","wordOrder":"BE"}', '2025-03-25 11:06:53', NULL),
	(1027, 1, 36, 'TCP', 6000, '{"unitId":"2","byteOrder":"BE","wordOrder":"BE"}', '2025-03-25 11:06:53', '2025-03-26 15:09:21');

-- Dump della struttura di tabella datalogger.restore_task
CREATE TABLE IF NOT EXISTS `restore_task` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `startTime` timestamp NULL DEFAULT current_timestamp(),
  `endTime` timestamp NULL DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `totalItems` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=294 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.restore_task: ~0 rows (circa)
DELETE FROM `restore_task`;

-- Dump della struttura di tabella datalogger.setting
CREATE TABLE IF NOT EXISTS `setting` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `group` enum('ads','mqtt','saf','modbus','system') NOT NULL DEFAULT 'ads',
  `order` text DEFAULT NULL,
  `key` varchar(255) NOT NULL,
  `value` mediumtext DEFAULT NULL,
  `defaultValue` mediumtext DEFAULT NULL,
  `domain` mediumtext DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.setting: ~42 rows (circa)
DELETE FROM `setting`;
INSERT INTO `setting` (`id`, `group`, `order`, `key`, `value`, `defaultValue`, `domain`, `note`) VALUES
	(2, 'ads', NULL, 'symbol', 'GVL.devices', 'GVL.devices', NULL, NULL),
	(3, 'mqtt', '1', 'host', '127.0.0.1', '10.36.22.116', NULL, NULL),
	(4, 'mqtt', NULL, 'username', 'antonio', 'MqttUser', NULL, NULL),
	(5, 'mqtt', NULL, 'password', 'antonio', '&!V6B1RKa4*YLmIegr5tt1', NULL, NULL),
	(6, 'saf', NULL, 'maxDbSizeGB', '6', '5', 'Number', 'GB'),
	(7, 'system', NULL, 'executionTime', '3000', '3000', 'Number', NULL),
	(9, 'mqtt', NULL, 'qos', '0', '0', 'Number', NULL),
	(10, 'mqtt', NULL, 'retain', '0', 'false', 'Bool', NULL),
	(11, 'mqtt', NULL, 'maxRetries', '22dddddd', '100', 'Number', NULL),
	(12, 'mqtt', NULL, 'topic', '34', 'telemetry/v1/devices', 'String', NULL),
	(13, 'mqtt', NULL, 'keepalive', '3', '3', 'Number', NULL),
	(14, 'mqtt', NULL, 'protocolId', 'MQTT', 'MQTT', NULL, NULL),
	(15, 'mqtt', NULL, 'protocolVersion', '4', '4', 'Number', NULL),
	(16, 'mqtt', NULL, 'connectTimeout', '3000', '4000', 'Number', NULL),
	(17, 'mqtt', NULL, 'reconnectPeriod', '1000', '1000', 'Number', NULL),
	(18, 'mqtt', NULL, 'protocol', 'mqtt', 'mqtts', '[\'mqtt\',\'mqtts\']', NULL),
	(19, 'mqtt', '2', 'port', '1883', '8883', 'Number', NULL),
	(20, 'ads', NULL, 'localAmsNetId', '192.168.21.34.1.1', NULL, NULL, NULL),
	(21, 'ads', NULL, 'localAdsPort', '32751', NULL, NULL, NULL),
	(22, 'ads', NULL, 'targetAmsNetId', '5.151.62.224.1.1', '127.0.0.1.1.1', 'Number', NULL),
	(23, 'ads', NULL, 'targetAdsPort', '851', '851', 'Number', NULL),
	(24, 'ads', NULL, 'routerAddress', '192.168.21.37', NULL, NULL, NULL),
	(25, 'ads', NULL, 'routerTcpPort', '48898', NULL, NULL, NULL),
	(26, 'mqtt', NULL, 'dup', 'false', 'false', 'Bool', NULL),
	(28, 'modbus', NULL, 'primaryTime', '13000', '25000', 'Number', NULL),
	(30, 'ads', NULL, 'timeIndicator', 'GVL.tTime', 'MAIN.tTime', NULL, NULL),
	(31, 'ads', NULL, 'systemTime', '100000', '10000', 'Number', NULL),
	(33, 'system', NULL, 'enableBitmask', 'true', 'true', 'Bool', NULL),
	(34, 'system', NULL, 'enableEnumeration', 'false', 'false', 'Bool', NULL),
	(35, 'system', NULL, 'dataLoggerId', '1', '1', 'Number', NULL),
	(36, 'system', NULL, 'lastTimestamp', '0', '0', 'Number', NULL),
	(37, 'saf', NULL, 'bufferBatchMinute', '.2', '5', 'Number', 'Minuti'),
	(38, 'system', NULL, 'fullInfo', '0', '0', 'Number', NULL),
	(39, 'system', NULL, 'adsConfigTime', '0', '0', 'Number', NULL),
	(40, 'mqtt', NULL, 'rejectUnauthorized', 'false', 'false', 'Bool', NULL),
	(41, 'mqtt', NULL, 'ca', NULL, 'ca.crt', NULL, NULL),
	(42, 'mqtt', NULL, 'cert', NULL, 'client.crt', NULL, NULL),
	(43, 'mqtt', NULL, 'key', NULL, 'client.key', NULL, NULL),
	(44, 'mqtt', NULL, 'TLS', 'false', 'true', 'Bool', NULL),
	(47, 'saf', NULL, 'forwardEnabled', '1', '1', 'Number', 'Enable or disable the restore task'),
	(52, 'modbus', NULL, 'enableRTU', '0', '0', 'Number', 'Enable or disable RTU'),
	(53, 'saf', NULL, 'restoreEnabled', '1', '1', 'Number', 'Enable or disable the restore task');

-- Dump della struttura di tabella datalogger.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `role` enum('admin','operator','supervisor') NOT NULL DEFAULT 'operator',
  `enabled` enum('0','1') NOT NULL DEFAULT '1',
  `deleted` enum('0','1') NOT NULL DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dump dei dati della tabella datalogger.user: ~3 rows (circa)
DELETE FROM `user`;
INSERT INTO `user` (`id`, `name`, `email`, `username`, `password`, `role`, `enabled`, `deleted`, `createdAt`, `updateAt`) VALUES
	(3, 'Admin', 'admin@wisnam.com', 'admin', '636dd017208d80332157ca6259f59551eaf8696f', 'admin', '1', '0', '2024-10-30 14:32:20', '2025-01-24 13:17:45'),
	(4, 'Supervisor', 'supervisor@wisnam.com', 'supervisor', '9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684', 'supervisor', '1', '0', '2024-10-30 14:32:20', '2025-03-26 15:11:14'),
	(8, 'Operator', 'operator@gmail.com', 'operator', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 'operator', '1', '0', '2024-12-11 05:26:13', '2025-03-26 15:11:34');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
