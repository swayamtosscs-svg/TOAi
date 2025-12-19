-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2025 at 08:37 AM
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
(10, 'mol@gmail.com', 'mol3', 'scrypt:32768:8:1$mlGnQvpeLULCLHVC$1c8c346b21af166ad482528af440faaf609477280374c115798e950bb7c383d75a882e8e03450b8f7016867106013faedd61cefdba96ab4470797e601826edb5', 'admin', 'tally', '2025-12-09 06:37:51', '2025-12-09 06:33:09');

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
  `project` varchar(150) DEFAULT NULL,
  `sender_type` enum('user','user_admin','toai_ai') NOT NULL,
  `message` text NOT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `toai_message`
--

INSERT INTO `toai_message` (`id`, `user_id`, `session_id`, `project`, `sender_type`, `message`, `meta`, `created_at`, `updated_at`) VALUES
(1, 1, 'default-session', NULL, 'user', 'hii', NULL, '2025-12-17 12:15:31', '2025-12-17 12:15:31'),
(2, 1, 'default-session', NULL, 'toai_ai', 'It\'s nice to meet you. Is there something I can help you with or would you like to chat? I\'m here to assist you with any questions or topics you\'d like to discuss.', NULL, '2025-12-17 12:15:32', '2025-12-17 12:15:32'),
(3, 1, 'default-session', NULL, 'user', 'hlo bot', NULL, '2025-12-17 12:16:00', '2025-12-17 12:16:00'),
(4, 1, 'default-session', NULL, 'toai_ai', 'Hello. It\'s nice to meet you. Is there something I can help you with or would you like to chat?', NULL, '2025-12-17 12:16:01', '2025-12-17 12:16:01'),
(5, 1, 'default-session', NULL, 'user', 'hii', NULL, '2025-12-17 12:20:07', '2025-12-17 12:20:07'),
(6, 1, 'default-session', NULL, 'toai_ai', 'It\'s nice to meet you. Is there something I can help you with or would you like to chat? I\'m here to assist you with any questions or topics you\'d like to discuss.', NULL, '2025-12-17 12:20:07', '2025-12-17 12:20:07'),
(7, 1, 'default-session', NULL, 'user', 'whats going on', NULL, '2025-12-17 12:20:17', '2025-12-17 12:20:17'),
(8, 1, 'default-session', NULL, 'toai_ai', 'It seems like you\'re looking for a general update or perhaps some conversation. There\'s a lot happening in the world, and I\'d be happy to discuss various topics with you. Here are a few options:\n\n1. **News**: We could talk about current events, such as politics, natural disasters, or significant announcements.\n2. **Technology**: If you\'re interested in tech, we could discuss the latest advancements in fields like AI, space exploration, or new gadgets.\n3. **Entertainment**: Maybe you\'d like to know about new movie releases, TV shows, music, or books?\n4. **Hobbies**: We could explore topics related to your favorite hobbies or interests, such as sports, travel, or cooking.\n5. **General knowledge**: If you have a specific question or topic in mind, feel free to ask, and I\'ll do my best to provide information and insights.\n\nWhat sounds interesting to you, or is there something specific you\'d like to know about?', NULL, '2025-12-17 12:20:17', '2025-12-17 12:20:17'),
(9, 1, 'session-1765974431233', NULL, 'user', 'what is science', NULL, '2025-12-17 12:27:35', '2025-12-17 12:27:35'),
(10, 1, 'session-1765974431233', NULL, 'toai_ai', 'Science is a systematic and organized way of acquiring knowledge about the world around us. It involves the use of observation, experimentation, and evidence-based reasoning to understand and explain natural phenomena. Science aims to provide a comprehensive and accurate understanding of the universe, from the smallest subatomic particles to the vast expanse of the cosmos.\n\nThe key characteristics of science include:\n\n1. **Systematic observation**: Scientists use their senses and instruments to collect data and make observations about the world.\n2. **Hypothesis formation**: Based on observations, scientists formulate hypotheses or educated guesses to explain what they have observed.\n3. **Experimentation**: Scientists design and conduct experiments to test their hypotheses and gather more data.\n4. **Data analysis**: Scientists analyze the data collected from their experiments to determine whether their hypotheses are supported or not.\n5. **Peer review**: Scientists share their findings with others in the scientific community, who review and critique the work to ensure its validity and accuracy.\n6. **Replication**: Scientists repeat experiments to verify the results and ensure that they are consistent and reliable.\n\nThe scientific method is a cyclical process that involves:\n\n1. **Questioning**: Identifying a problem or phenomenon to be studied.\n2. **Hypothesizing**: Formulating a hypothesis to explain the phenomenon.\n3. **Predicting**: Making predictions based on the hypothesis.\n4. **Testing**: Conducting experiments to test the hypothesis.\n5. **Analyzing**: Analyzing the data collected from the experiments.\n6. **Concluding**: Drawing conclusions based on the data and refining the hypothesis.\n\nScience is divided into several branches, including:\n\n1. **Natural sciences**: Physics, chemistry, biology, and earth sciences, which study the natural world.\n2. **Formal sciences**: Mathematics, logic, and computer science, which study abstract systems and structures.\n3. **Social sciences**: Psychology, sociology, anthropology, and economics, which study human behavior and social systems.\n4. **Applied sciences**: Engineering, medicine, and technology, which apply scientific knowledge to practical problems.\n\nScience has many benefits, including:\n\n1. **Advancing knowledge**: Science helps us understand the world and the universe.\n2. **Improving technology**: Science leads to the development of new technologies and innovations.\n3. **Solving problems**: Science helps us address complex problems and challenges.\n4. **Informing policy**: Science informs decision-making and policy development.\n\nOverall, science is a powerful tool for understanding the world and improving our lives. It is a continuous process of discovery, experimentation, and innovation that has transformed our world and will continue to shape our future.', NULL, '2025-12-17 12:27:37', '2025-12-17 12:27:37'),
(11, 1, 'session-1765978849282', NULL, 'user', 'hii', NULL, '2025-12-17 13:40:53', '2025-12-17 13:40:53'),
(12, 1, 'session-1765978849282', NULL, 'toai_ai', 'It\'s nice to meet you. Is there something I can help you with or would you like to chat? I\'m here to assist you with any questions or topics you\'d like to discuss.', NULL, '2025-12-17 13:40:54', '2025-12-17 13:40:54'),
(13, 1, 'session-1765978849282', NULL, 'user', 'what going on my whatsapp group', NULL, '2025-12-17 13:42:42', '2025-12-17 13:42:42'),
(14, 1, 'session-1765978849282', NULL, 'toai_ai', 'I\'m not capable of accessing your WhatsApp group or any other personal data. I\'m a text-based AI assistant, and our conversation just started, so I don\'t have any information about your WhatsApp group.\n\nIf you\'d like to share what\'s going on in your WhatsApp group or discuss something specific, I\'m here to listen and help if I can. Please feel free to share more about what\'s on your mind!', NULL, '2025-12-17 13:42:43', '2025-12-17 13:42:43'),
(15, 4, 'session-1766041404661', NULL, 'user', 'hi', NULL, '2025-12-18 07:08:16', '2025-12-18 07:08:16'),
(16, 4, 'session-1766041404661', NULL, 'toai_ai', 'It seems like you\'ve provided a vast amount of context from various sources, including emails and policy documents related to finance and human resources. However, your question is simply \"hi,\" which doesn\'t directly relate to the context you\'ve provided.\n\nIf you\'re looking for a greeting in response, I can certainly offer that. Hello! It\'s nice to interact with you. If you have a specific question or need information related to the context you\'ve provided (such as details about the company\'s finance policy, HR policies, or anything else), please feel free to ask, and I\'ll do my best to provide a detailed and helpful response based on the information available.', NULL, '2025-12-18 07:08:18', '2025-12-18 07:08:18'),
(17, 4, 'session-1766041710312', NULL, 'user', 'hi', NULL, '2025-12-18 07:08:33', '2025-12-18 07:08:33'),
(18, 4, 'session-1766041710312', NULL, 'toai_ai', 'It seems like you\'ve provided a vast amount of context from various sources, including emails and policy documents related to finance and human resources. However, your question is simply \"hi,\" which doesn\'t directly relate to the context you\'ve provided.\n\nIf you\'re looking for a greeting in response, I can certainly offer that. Hello! It\'s nice to interact with you. If you have a specific question or need information related to the context you\'ve provided (such as details about the company\'s finance policy, HR policies, or anything else), please feel free to ask, and I\'ll do my best to provide a detailed and helpful response based on the information available.\n\nFrom the context, I can see that there are emails related to resetting a TOAI password and extensive details from the Finance-Policypdf.pdf and HR-Policypdf.pdf documents. These documents cover a wide range of topics, including financial governance, accounting policies, budgeting, cash management, employment classification, working hours, attendance, leave policy, and more.\n\nIf you have a specific query related to any of these topics or need clarification on any of the policies mentioned, I\'m here to help. Please provide a more detailed question so I can offer a more precise and helpful response.', NULL, '2025-12-18 07:08:34', '2025-12-18 07:08:34'),
(19, 4, 'project-1766042724113', 'Investing', 'user', 'hi', NULL, '2025-12-18 07:25:58', '2025-12-18 07:25:58'),
(20, 4, 'project-1766042724113', 'Investing', 'toai_ai', 'It seems like you\'ve provided a vast amount of context from various sources, including emails and policy documents related to finance and human resources. However, your question is simply \"hi,\" which doesn\'t directly relate to the context you\'ve provided.\n\nIf you\'re looking for a greeting in response, I can certainly offer that. Hello! It\'s nice to interact with you. If you have a specific question or need information related to the context you\'ve provided (such as details about the company\'s finance policy, HR policies, or anything else), please feel free to ask, and I\'ll do my best to provide a detailed and helpful response based on the information available.\n\nFrom the context, I can see that there are emails related to resetting a TOAI password and extensive details from the Finance-Policypdf.pdf and HR-Policypdf.pdf documents. These documents cover a wide range of topics, including financial governance, accounting policies, budgeting, cash management, employment classification, working hours, attendance, leave policy, and more.\n\nIf you have a specific query related to any of these topics or need clarification on any of the policies mentioned, I\'m here to help. Please provide a more detailed question so I can offer a more precise and helpful response.\n\nFor instance, you could ask about the company\'s policy on cash handling, reimbursement procedures, or leave entitlements. You could also inquire about the probation period for new employees, the process for reporting financial irregularities, or the guidelines for maintaining confidentiality of financial information.\n\nPlease feel free to ask your question, and I\'ll do my best to provide a detailed and helpful response based on the context you\'ve provided.', NULL, '2025-12-18 07:25:59', '2025-12-18 07:25:59'),
(21, 4, 'project-1766042724113', 'Investing', 'user', 'kjhuybu', NULL, '2025-12-18 07:26:29', '2025-12-18 07:26:29'),
(22, 4, 'project-1766042724113', 'Investing', 'toai_ai', 'It seems like you\'ve provided a vast amount of context from various sources, including emails and policy documents related to finance and human resources. However, your question \"kjhuybu\" doesn\'t directly relate to the context you\'ve provided, and it appears to be a random string of characters.\n\nIf you\'re looking for a greeting in response, I can certainly offer that. Hello! It\'s nice to interact with you. If you have a specific question or need information related to the context you\'ve provided (such as details about the company\'s finance policy, HR policies, or anything else), please feel free to ask, and I\'ll do my best to provide a detailed and helpful response based on the information available.\n\nFrom the context, I can see that there are emails related to resetting a TOAI password and extensive details from the Finance-Policypdf.pdf and HR-Policypdf.pdf documents. These documents cover a wide range of topics, including financial governance, accounting policies, budgeting, cash management, employment classification, working hours, attendance, leave policy, and more.\n\nIf you have a specific query related to any of these topics or need clarification on any of the policies mentioned, I\'m here to help. Please provide a more detailed question so I can offer a more precise and helpful response.\n\nFor instance, you could ask about the company\'s policy on cash handling, reimbursement procedures, or leave entitlements. You could also inquire about the probation period for new employees, the process for reporting financial irregularities, or the guidelines for maintaining confidentiality of financial information.\n\nPlease feel free to ask your question, and I\'ll do my best to provide a detailed and helpful response based on the context you\'ve provided.', NULL, '2025-12-18 07:26:31', '2025-12-18 07:26:31'),
(23, 4, 'project-1766042818674', 'Homework', 'user', 'unuinio', NULL, '2025-12-18 07:27:07', '2025-12-18 07:27:07'),
(24, 4, 'project-1766042818674', 'Homework', 'toai_ai', 'It seems like you\'ve provided a vast amount of context from various sources, including emails and policy documents related to finance and human resources. However, your question \"unuinio\" doesn\'t directly relate to the context you\'ve provided, and it appears to be a random string of characters.\n\nIf you\'re looking for a greeting in response, I can certainly offer that. Hello! It\'s nice to interact with you. If you have a specific question or need information related to the context you\'ve provided (such as details about the company\'s finance policy, HR policies, or anything else), please feel free to ask, and I\'ll do my best to provide a detailed and helpful response based on the information available.\n\nFrom the context, I can see that there are emails related to resetting a TOAI password and extensive details from the Finance-Policypdf.pdf and HR-Policypdf.pdf documents. These documents cover a wide range of topics, including financial governance, accounting policies, budgeting, cash management, employment classification, working hours, attendance, leave policy, and more.\n\nIf you have a specific query related to any of these topics or need clarification on any of the policies mentioned, I\'m here to help. Please provide a more detailed question so I can offer a more precise and helpful response.\n\nFor instance, you could ask about the company\'s policy on cash handling, reimbursement procedures, or leave entitlements. You could also inquire about the probation period for new employees, the process for reporting financial irregularities, or the guidelines for maintaining confidentiality of financial information.\n\nPlease feel free to ask your question, and I\'ll do my best to provide a detailed and helpful response based on the context you\'ve provided. \n\nHowever, since you haven\'t asked a specific question, I\'ll provide some general information based on the context. \n\nThe company has a well-structured finance policy that covers various aspects such as financial governance, accounting policies, budgeting, cash management, and more. The policy emphasizes the importance of financial discipline, transparency, and compliance with applicable laws and regulations.\n\nThe company also has a comprehensive HR policy that outlines the code of conduct, performance management, disciplinary action, separation policy, and confidentiality and data protection guidelines. The policy aims to ensure a fair and respectful work environment, promote employee growth and development, and protect the company\'s interests.\n\nIf you have any specific questions or need further clarification on any of these topics, please don\'t hesitate to ask. I\'m here to help.', NULL, '2025-12-18 07:27:09', '2025-12-18 07:27:09'),
(25, 4, 'project-1766043183898', 'Investing', 'user', 'hjji', NULL, '2025-12-18 07:33:08', '2025-12-18 07:33:08'),
(26, 4, 'project-1766043183898', 'Investing', 'toai_ai', 'It seems like you\'ve provided a vast amount of context from various sources, including emails and policy documents related to finance and human resources. However, your question \"hjji\" doesn\'t directly relate to the context you\'ve provided, and it appears to be a random string of characters.\n\nIf you\'re looking for a greeting in response, I can certainly offer that. Hello! It\'s nice to interact with you. If you have a specific question or need information related to the context you\'ve provided (such as details about the company\'s finance policy, HR policies, or anything else), please feel free to ask, and I\'ll do my best to provide a detailed and helpful response based on the information available.\n\nFrom the context, I can see that there are emails related to resetting a TOAI password and extensive details from the Finance-Policypdf.pdf and HR-Policypdf.pdf documents. These documents cover a wide range of topics, including financial governance, accounting policies, budgeting, cash management, employment classification, working hours, attendance, leave policy, and more.\n\nIf you have a specific query related to any of these topics or need clarification on any of the policies mentioned, I\'m here to help. Please provide a more detailed question so I can offer a more precise and helpful response.\n\nFor instance, you could ask about the company\'s policy on cash handling, reimbursement procedures, or leave entitlements. You could also inquire about the probation period for new employees, the process for reporting financial irregularities, or the guidelines for maintaining confidentiality of financial information.\n\nPlease feel free to ask your question, and I\'ll do my best to provide a detailed and helpful response based on the context you\'ve provided.\n\nHowever, since you haven\'t asked a specific question, I\'ll provide some general information based on the context.\n\nThe company has a well-structured finance policy that covers various aspects such as financial governance, accounting policies, budgeting, cash management, and more. The policy emphasizes the importance of financial discipline, transparency, and compliance with applicable laws and regulations.\n\nThe company also has a comprehensive HR policy that outlines the code of conduct, performance management, disciplinary action, separation policy, and confidentiality and data protection guidelines. The policy aims to ensure a fair and respectful work environment, promote employee growth and development, and protect the company\'s interests.\n\nIf you have any specific questions or need further clarification on any of these topics, please don\'t hesitate to ask. I\'m here to help.', NULL, '2025-12-18 07:33:10', '2025-12-18 07:33:10'),
(27, 4, 'project-1766043277930', 'ben10', 'user', 'hlo ben', NULL, '2025-12-18 07:34:50', '2025-12-18 07:34:50'),
(28, 4, 'project-1766043277930', 'ben10', 'toai_ai', 'It seems like you\'ve provided a vast amount of context from various sources, including emails and policy documents related to finance and human resources. However, your question \"hlo ben\" doesn\'t directly relate to the context you\'ve provided, and it appears to be an informal greeting.\n\nIf you\'re looking for a greeting in response, I can certainly offer that. Hello! It\'s nice to interact with you. If you have a specific question or need information related to the context you\'ve provided (such as details about the company\'s finance policy, HR policies, or anything else), please feel free to ask, and I\'ll do my best to provide a detailed and helpful response based on the information available.\n\nFrom the context, I can see that there are emails related to resetting a TOAI password and extensive details from the Finance-Policypdf.pdf and HR-Policypdf.pdf documents. These documents cover a wide range of topics, including financial governance, accounting policies, budgeting, cash management, employment classification, working hours, attendance, leave policy, and more.\n\nIf you have a specific query related to any of these topics or need clarification on any of the policies mentioned, I\'m here to help. Please provide a more detailed question so I can offer a more precise and helpful response.\n\nFor instance, you could ask about the company\'s policy on cash handling, reimbursement procedures, or leave entitlements. You could also inquire about the probation period for new employees, the process for reporting financial irregularities, or the guidelines for maintaining confidentiality of financial information.\n\nPlease feel free to ask your question, and I\'ll do my best to provide a detailed and helpful response based on the context you\'ve provided. \n\nHowever, since you haven\'t asked a specific question, I\'ll provide some general information based on the context. \n\nThe company has a well-structured finance policy that covers various aspects such as financial governance, accounting policies, budgeting, cash management, and more. The policy emphasizes the importance of financial discipline, transparency, and compliance with applicable laws and regulations.\n\nThe company also has a comprehensive HR policy that outlines the code of conduct, performance management, disciplinary action, separation policy, and confidentiality and data protection guidelines. The policy aims to ensure a fair and respectful work environment, promote employee growth and development, and protect the company\'s interests.\n\nIf you have any specific questions or need further clarification on any of these topics, please don\'t hesitate to ask. I\'m here to help.', NULL, '2025-12-18 07:34:53', '2025-12-18 07:34:53'),
(29, 4, 'project-1766043321322', 'toai', 'user', 'hlo toai', NULL, '2025-12-18 07:35:31', '2025-12-18 07:35:31'),
(30, 4, 'project-1766043321322', 'toai', 'toai_ai', 'Based on the context provided, it seems like you\'re trying to say \"hello\" to TOAI, but there\'s no direct information about what TOAI is or what it refers to in the given context.\n\nHowever, I did find a mention of \"TOAI\" in one of the email subjects: \"Fwd: Reset your TOAI password\". This suggests that TOAI might be related to a password reset or an account login system.\n\nIf you\'re trying to ask about the TOAI password reset, I can tell you that the email provides a link to reset the password, which is valid for 10 minutes. The link is: http://localhost:5173/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwicHVycG9zZSI6InBhc3N3b3JkX3Jlc2V0IiwiaWF0IjoxNzY1OTY0MTM1LCJleHAiOjE3NjU5NjQ3MzV9.8LdywQECWjKw6NAGRdx-vOs4zSzQQ-c_xeza39wukP0\n\nPlease note that this link is likely only accessible within a local network or development environment, and it may not be accessible from outside.\n\nIf you have any further questions or if there\'s anything else I can help you with, please feel free to ask!', NULL, '2025-12-18 07:35:34', '2025-12-18 07:35:34');

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
  `name` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `prompt_template` text NOT NULL,
  `preview` text DEFAULT NULL,
  `viewer` varchar(191) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `toai_user_save`
--

INSERT INTO `toai_user_save` (`id`, `user_id`, `session_id`, `name`, `description`, `tags`, `scope`, `prompt_template`, `preview`, `viewer`, `created_at`) VALUES
(1, 1, NULL, 'science', 'what is science', 'email', 'weekly', 'what is science', 'what is science', 'owner', '2025-12-17 19:08:00');

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
  `category` enum('employee','hr','finance','bussiness','reception','owner') NOT NULL,
  `user_admin_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_admin_email` varchar(191) DEFAULT NULL,
  `token_uses` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `category`, `user_admin_id`, `user_admin_email`, `token_uses`, `profile_image`, `created_at`, `updated_at`) VALUES
(1, 'shivam kumar', 'shivam@kumar.com', '$2a$12$zTEBUg.AQdry7bahNpurk.QQsZIfjZYkPvR5uTCe2FbDLKk5VTBJu', 'user', 'employee', NULL, NULL, 0, NULL, '2025-12-16 17:58:44', '2025-12-16 17:58:44'),
(2, 'Geetanjali', 'geetanjali@gmail.com', '$2a$12$x/ORSX4/.lsqscVNKidGnuRzRKc70xf7u6ulK5c3MwAvXQVrEyimC', 'user', 'employee', NULL, NULL, 0, NULL, '2025-12-18 11:37:11', '2025-12-18 11:37:11'),
(3, 'Geetanjali Kushwaha', 'geetanjali.tosscs@gmail.com', '$2a$12$vNMVex/ncV576AcJ5jabHu6eR6jm5XJlgQUd/0zmUOLh9Sw/XyUlK', 'user', 'employee', NULL, NULL, 0, NULL, '2025-12-18 11:48:08', '2025-12-18 11:48:08'),
(4, 'Swayam Patwa', 'swayam.toss.cs@gmail.com', '$2a$12$vlBl9WeihoruimtQ98jPWefiE5s9T.KSqlkRWfD8ZtIrWyWbrMnJu', 'user', 'employee', NULL, NULL, 0, NULL, '2025-12-18 11:50:51', '2025-12-18 11:50:51'),
(5, 'Finance_Toss', 'demofinancetoss2025@gmail.com', '$2a$12$UT97sSdtFbABO5a8ZI659.N/FhHv4U3x45haYp4IH3pU4kbEIH8/m', 'user', 'employee', NULL, NULL, 0, NULL, '2025-12-18 12:20:58', '2025-12-18 12:20:58');

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
  ADD KEY `idx_user_session` (`user_id`,`session_id`,`created_at`),
  ADD KEY `idx_session_created` (`session_id`,`created_at`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
