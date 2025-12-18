-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2025 at 11:40 AM
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
-- Database: `ai_saas`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(120) NOT NULL,
  `username` varchar(80) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','super admin') NOT NULL,
  `module` varchar(100) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `username`, `password_hash`, `role`, `module`, `last_login`, `created_at`) VALUES
(1, 'admin@gmail.com', 'admin', 'scrypt:32768:8:1$npLziGgjNraMAYF5$88e281ee2e1b3baeacef6d4e81992527095cd402ca3317e0f4269c52c20903424aa2189f26699e77f4264dfadad84757ef89a94e6d57951e70b799c4b739b33c', 'admin', NULL, '2025-12-16 09:00:11', '2025-12-08 06:20:52'),
(2, 'superadmin@gmail.com', 'superadmin', 'scrypt:32768:8:1$bM7xHfQSPAcNBrOi$0b2b045f29c480f65d18105ba29c027ac9ebf8aadd34dea10a50d83d580e8f073e75cf0a90f62a5713304d279f28d586e8b9eaa7ab23446383114d4b8f6367c9', 'super admin', NULL, '2025-12-15 13:31:45', '2025-12-08 12:10:59'),
(10, 'mol@gmail.com', 'mol3', 'scrypt:32768:8:1$mlGnQvpeLULCLHVC$1c8c346b21af166ad482528af440faaf609477280374c115798e950bb7c383d75a882e8e03450b8f7016867106013faedd61cefdba96ab4470797e601826edb5', 'admin', 'tally', '2025-12-09 06:37:51', '2025-12-09 06:33:09'),
(14, 'admin@example.com', 'admin_example', 'scrypt:32768:8:1$rrwFtxuKOTx6QWjG$79b8aa77240b64af351cc908c48b502f146a2f9c597d00aa7415871aa95d9c28a53af322fed76b77e8750c10cd85fe65d4d6a16f2e196429afb300a0c8e0a1ce', 'admin', NULL, '2025-12-15 08:14:42', '2025-12-15 12:28:33'),
(15, 'superadmin@example.com', 'superadmin_example', 'scrypt:32768:8:1$NOJr6OzvsaHt9kty$dc7d131b82fb508e9656c3befd752a647aaa6c1b22e665be994f226545dedf450f63e53e7d85160f257905483183688556aecd74b1751f965e9b4b0252f656ce', 'super admin', NULL, '2025-12-15 07:44:30', '2025-12-15 12:28:33'),
(16, 'useradmin@example.com', 'useradmin_example', 'scrypt:32768:8:1$7G4xLgWh7TKjkUb0$5fd7cabafd631663af71d01ebe85d859f6f7b202a883b5b24d8b36ca7955c485ee3f916047d696dad66bcd5d7f21817fb2e5424ea56b5f6f375d8e395e0b05f6', '', NULL, '2025-12-16 08:59:57', '2025-12-15 12:28:33');

-- --------------------------------------------------------

--
-- Table structure for table `gpt_users`
--

CREATE TABLE `gpt_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gpt_users`
--

INSERT INTO `gpt_users` (`id`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'admin@gmail.com', '$2b$12$gmcMMxt/3c0urY6evjxdrOBo2FEmh4HW4aQr3R/6JkS7oJZBvIPoy', '2025-12-11 04:59:01', '2025-12-11 04:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `toai_activity_logs`
--

CREATE TABLE `toai_activity_logs` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `activity` text NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `meta_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_addons`
--

CREATE TABLE `toai_addons` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_ai_models`
--

CREATE TABLE `toai_ai_models` (
  `id` int(11) NOT NULL,
  `model_name` varchar(150) NOT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`config_json`)),
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_api_usage`
--

CREATE TABLE `toai_api_usage` (
  `id` bigint(20) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `request_count` int(11) NOT NULL DEFAULT 0,
  `week_start` date NOT NULL,
  `week_end` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_clients`
--

CREATE TABLE `toai_clients` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `status` enum('paid','unpaid','upcoming','installation_pending') NOT NULL DEFAULT 'upcoming',
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_companies`
--

CREATE TABLE `toai_companies` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `subscription_plan` varchar(100) DEFAULT NULL,
  `plan_expiry` date DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_company_addons`
--

CREATE TABLE `toai_company_addons` (
  `id` bigint(20) NOT NULL,
  `company_id` int(11) NOT NULL,
  `addon_id` int(11) NOT NULL,
  `purchased_on` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_gmail_integrations`
--

CREATE TABLE `toai_gmail_integrations` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `client_secret` varchar(255) DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `authorized_email` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_load_balancing_logs`
--

CREATE TABLE `toai_load_balancing_logs` (
  `id` bigint(20) NOT NULL,
  `model_id` int(11) DEFAULT NULL,
  `server_node` varchar(150) DEFAULT NULL,
  `requests` int(11) NOT NULL DEFAULT 0,
  `response_time_ms` float DEFAULT NULL,
  `week_start` date NOT NULL,
  `week_end` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_message`
--

CREATE TABLE `toai_message` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(64) NOT NULL,
  `sender_type` enum('user','user_admin','toai_ai') NOT NULL,
  `message` text NOT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_model_usage`
--

CREATE TABLE `toai_model_usage` (
  `id` bigint(20) NOT NULL,
  `model_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `tokens_used` bigint(20) NOT NULL DEFAULT 0,
  `requests_count` int(11) NOT NULL DEFAULT 0,
  `week_start` date NOT NULL,
  `week_end` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_plans`
--

CREATE TABLE `toai_plans` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `credits` int(11) NOT NULL DEFAULT 0,
  `validity_days` int(11) NOT NULL DEFAULT 30,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_users`
--

CREATE TABLE `toai_users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','client_admin','end_user') NOT NULL DEFAULT 'end_user',
  `parent_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_user_adon`
--

CREATE TABLE `toai_user_adon` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `addon_code` varchar(64) NOT NULL,
  `addon_name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `purchased_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_user_permissions`
--

CREATE TABLE `toai_user_permissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `module` varchar(100) NOT NULL,
  `permission` enum('none','read','write') NOT NULL DEFAULT 'none',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_user_save`
--

CREATE TABLE `toai_user_save` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `session_id` varchar(64) DEFAULT NULL,
  `prompt_text` text NOT NULL,
  `response_text` text DEFAULT NULL,
  `title` varchar(191) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_user_subscriptions`
--

CREATE TABLE `toai_user_subscriptions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `toai_user_tokens`
--

CREATE TABLE `toai_user_tokens` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user_admin','user') NOT NULL DEFAULT 'user',
  `user_admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_admin_email` varchar(191) DEFAULT NULL,
  `token_uses` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `work_type` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `last_price` decimal(12,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `lead_time_days` int(11) DEFAULT NULL,
  `reliability_score` decimal(5,2) DEFAULT NULL,
  `warranty_months` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `membership_price` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `name`, `email`, `phone`, `work_type`, `status`, `created_by`, `created_at`, `phone_number`, `last_price`, `currency`, `lead_time_days`, `reliability_score`, `warranty_months`, `notes`, `city`, `membership_price`) VALUES
(1, 'Mohit', 'mohit@gmail.com', '8956232323', 'drive', 'active', 2, '2025-12-09 09:16:31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'm', 'm@gmail.com', '8956324156', 'whatsapp', 'active', 1, '2025-12-09 12:53:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_admins_username` (`username`),
  ADD UNIQUE KEY `ix_admins_email` (`email`);

--
-- Indexes for table `gpt_users`
--
ALTER TABLE `gpt_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `toai_activity_logs`
--
ALTER TABLE `toai_activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `toai_addons`
--
ALTER TABLE `toai_addons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `toai_ai_models`
--
ALTER TABLE `toai_ai_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `provider` (`provider`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `toai_api_usage`
--
ALTER TABLE `toai_api_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `endpoint` (`endpoint`),
  ADD KEY `week_start` (`week_start`,`week_end`);

--
-- Indexes for table `toai_clients`
--
ALTER TABLE `toai_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `toai_companies`
--
ALTER TABLE `toai_companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_companies_status` (`status`);

--
-- Indexes for table `toai_company_addons`
--
ALTER TABLE `toai_company_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `addon_id` (`addon_id`);

--
-- Indexes for table `toai_gmail_integrations`
--
ALTER TABLE `toai_gmail_integrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `authorized_email` (`authorized_email`);

--
-- Indexes for table `toai_load_balancing_logs`
--
ALTER TABLE `toai_load_balancing_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `model_id` (`model_id`),
  ADD KEY `server_node` (`server_node`),
  ADD KEY `week_start` (`week_start`,`week_end`);

--
-- Indexes for table `toai_message`
--
ALTER TABLE `toai_message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_toai_message_user_session` (`user_id`,`session_id`),
  ADD KEY `idx_toai_message_session` (`session_id`);

--
-- Indexes for table `toai_model_usage`
--
ALTER TABLE `toai_model_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `model_id` (`model_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `week_start` (`week_start`,`week_end`),
  ADD KEY `idx_model_usage_company_week` (`company_id`,`week_start`);

--
-- Indexes for table `toai_plans`
--
ALTER TABLE `toai_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `price` (`price`);

--
-- Indexes for table `toai_users`
--
ALTER TABLE `toai_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `role` (`role`),
  ADD KEY `idx_users_email_role` (`email`,`role`);

--
-- Indexes for table `toai_user_adon`
--
ALTER TABLE `toai_user_adon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_toai_user_adon_user` (`user_id`),
  ADD KEY `idx_toai_user_adon_code` (`addon_code`);

--
-- Indexes for table `toai_user_permissions`
--
ALTER TABLE `toai_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_module` (`user_id`,`module`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `toai_user_save`
--
ALTER TABLE `toai_user_save`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_toai_user_save_user` (`user_id`);

--
-- Indexes for table `toai_user_subscriptions`
--
ALTER TABLE `toai_user_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `toai_user_tokens`
--
ALTER TABLE `toai_user_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_token_hash` (`token_hash`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_user_admin_id` (`user_admin_id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_vendors_email` (`email`),
  ADD KEY `created_by` (`created_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `gpt_users`
--
ALTER TABLE `gpt_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `toai_activity_logs`
--
ALTER TABLE `toai_activity_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_addons`
--
ALTER TABLE `toai_addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_ai_models`
--
ALTER TABLE `toai_ai_models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_api_usage`
--
ALTER TABLE `toai_api_usage`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_clients`
--
ALTER TABLE `toai_clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_companies`
--
ALTER TABLE `toai_companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_company_addons`
--
ALTER TABLE `toai_company_addons`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_gmail_integrations`
--
ALTER TABLE `toai_gmail_integrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_load_balancing_logs`
--
ALTER TABLE `toai_load_balancing_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_message`
--
ALTER TABLE `toai_message`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_model_usage`
--
ALTER TABLE `toai_model_usage`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_plans`
--
ALTER TABLE `toai_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_users`
--
ALTER TABLE `toai_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_user_adon`
--
ALTER TABLE `toai_user_adon`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_user_permissions`
--
ALTER TABLE `toai_user_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_user_save`
--
ALTER TABLE `toai_user_save`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_user_subscriptions`
--
ALTER TABLE `toai_user_subscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `toai_user_tokens`
--
ALTER TABLE `toai_user_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `toai_activity_logs`
--
ALTER TABLE `toai_activity_logs`
  ADD CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`) REFERENCES `toai_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `toai_api_usage`
--
ALTER TABLE `toai_api_usage`
  ADD CONSTRAINT `fk_api_usage_company` FOREIGN KEY (`company_id`) REFERENCES `toai_companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_api_usage_user` FOREIGN KEY (`user_id`) REFERENCES `toai_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `toai_clients`
--
ALTER TABLE `toai_clients`
  ADD CONSTRAINT `fk_clients_company` FOREIGN KEY (`company_id`) REFERENCES `toai_companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `toai_company_addons`
--
ALTER TABLE `toai_company_addons`
  ADD CONSTRAINT `fk_company_addon_addon` FOREIGN KEY (`addon_id`) REFERENCES `toai_addons` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_company_addon_company` FOREIGN KEY (`company_id`) REFERENCES `toai_companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `toai_gmail_integrations`
--
ALTER TABLE `toai_gmail_integrations`
  ADD CONSTRAINT `fk_gmail_company` FOREIGN KEY (`company_id`) REFERENCES `toai_companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `toai_load_balancing_logs`
--
ALTER TABLE `toai_load_balancing_logs`
  ADD CONSTRAINT `fk_lb_model` FOREIGN KEY (`model_id`) REFERENCES `toai_ai_models` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `toai_message`
--
ALTER TABLE `toai_message`
  ADD CONSTRAINT `fk_toai_message_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `toai_model_usage`
--
ALTER TABLE `toai_model_usage`
  ADD CONSTRAINT `fk_model_usage_company` FOREIGN KEY (`company_id`) REFERENCES `toai_companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_model_usage_model` FOREIGN KEY (`model_id`) REFERENCES `toai_ai_models` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_model_usage_user` FOREIGN KEY (`user_id`) REFERENCES `toai_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `toai_users`
--
ALTER TABLE `toai_users`
  ADD CONSTRAINT `fk_users_company` FOREIGN KEY (`company_id`) REFERENCES `toai_companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_users_parent` FOREIGN KEY (`parent_id`) REFERENCES `toai_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `toai_user_adon`
--
ALTER TABLE `toai_user_adon`
  ADD CONSTRAINT `fk_toai_user_adon_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `toai_user_permissions`
--
ALTER TABLE `toai_user_permissions`
  ADD CONSTRAINT `fk_user_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `toai_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `toai_user_save`
--
ALTER TABLE `toai_user_save`
  ADD CONSTRAINT `fk_toai_user_save_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `toai_user_subscriptions`
--
ALTER TABLE `toai_user_subscriptions`
  ADD CONSTRAINT `fk_user_sub_plan` FOREIGN KEY (`plan_id`) REFERENCES `toai_plans` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_sub_user` FOREIGN KEY (`user_id`) REFERENCES `toai_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `toai_user_tokens`
--
ALTER TABLE `toai_user_tokens`
  ADD CONSTRAINT `fk_user_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `toai_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_user_admin` FOREIGN KEY (`user_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `vendors`
--
ALTER TABLE `vendors`
  ADD CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
