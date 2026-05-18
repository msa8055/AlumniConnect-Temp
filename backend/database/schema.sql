-- AlumniConnect Database Schema for MySQL
-- Run this script to create all tables for the Java Spring Boot backend

SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS mentorship_requests;
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'ALUMNI', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
    phone VARCHAR(20),
    avatar VARCHAR(500),
    graduation_year INT,
    degree VARCHAR(100),
    major VARCHAR(100),
    current_company VARCHAR(200),
    current_position VARCHAR(200),
    location VARCHAR(200),
    bio TEXT,
    linkedin_url VARCHAR(500),
    skills JSON,
    is_mentor BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_graduation_year (graduation_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs table
CREATE TABLE jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    location VARCHAR(200) NOT NULL,
    type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE') NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    posted_by BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    application_deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_jobs_type (type),
    INDEX idx_jobs_posted_by (posted_by),
    INDEX idx_jobs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Applications table
CREATE TABLE job_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    resume_url VARCHAR(500),
    cover_letter TEXT,
    status ENUM('PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, applicant_id),
    INDEX idx_applications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_type ENUM('NETWORKING', 'WORKSHOP', 'SEMINAR', 'REUNION', 'CAREER_FAIR', 'WEBINAR', 'OTHER') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(300),
    is_virtual BOOLEAN DEFAULT FALSE,
    virtual_link VARCHAR(500),
    max_attendees INT,
    organizer_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_events_start_date (start_date),
    INDEX idx_events_type (event_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event Registrations table
CREATE TABLE event_registrations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status ENUM('REGISTERED', 'ATTENDED', 'CANCELLED', 'NO_SHOW') DEFAULT 'REGISTERED',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mentorship Requests table
CREATE TABLE mentorship_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mentor_id BIGINT NOT NULL,
    mentee_id BIGINT NOT NULL,
    message TEXT,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    topics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_mentorship_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conversations table (for messaging)
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    participant1_id BIGINT NOT NULL,
    participant2_id BIGINT NOT NULL,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_conversation (participant1_id, participant2_id),
    INDEX idx_conversations_last_message (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages table
CREATE TABLE messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_messages_conversation (conversation_id),
    INDEX idx_messages_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('JOB', 'EVENT', 'MENTORSHIP', 'MESSAGE', 'SYSTEM') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123 - should be bcrypt hashed in production)
INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified) 
VALUES ('admin@alumniconnect.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'User', 'ADMIN', TRUE, TRUE);

-- Insert sample alumni users
INSERT INTO users (email, password, first_name, last_name, role, graduation_year, degree, major, current_company, current_position, location, bio, is_mentor, is_active, email_verified)
VALUES 
('john.doe@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John', 'Doe', 'ALUMNI', 2018, 'Bachelor of Science', 'Computer Science', 'Google', 'Senior Software Engineer', 'San Francisco, CA', 'Passionate about technology and mentoring the next generation.', TRUE, TRUE, TRUE),
('jane.smith@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Smith', 'ALUMNI', 2019, 'Master of Business', 'Finance', 'Goldman Sachs', 'Investment Analyst', 'New York, NY', 'Finance professional with a passion for helping students.', TRUE, TRUE, TRUE),
('mike.johnson@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike', 'Johnson', 'ALUMNI', 2020, 'Bachelor of Arts', 'Marketing', 'Meta', 'Marketing Manager', 'Austin, TX', 'Creative marketer helping brands tell their stories.', FALSE, TRUE, TRUE);

-- Insert sample student users
INSERT INTO users (email, password, first_name, last_name, role, graduation_year, degree, major, is_active, email_verified)
VALUES 
('student1@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Alice', 'Williams', 'STUDENT', 2025, 'Bachelor of Science', 'Computer Science', TRUE, TRUE),
('student2@university.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob', 'Brown', 'STUDENT', 2026, 'Bachelor of Arts', 'Business Administration', TRUE, TRUE);

-- Insert sample jobs
INSERT INTO jobs (title, company, location, type, description, requirements, salary_min, salary_max, posted_by)
VALUES 
('Software Engineer', 'Google', 'Mountain View, CA', 'FULL_TIME', 'Join our team to build scalable systems that impact billions of users.', 'BS in Computer Science, 2+ years experience, proficiency in Java/Python', 120000.00, 180000.00, 2),
('Data Analyst Intern', 'Meta', 'Menlo Park, CA', 'INTERNSHIP', 'Summer internship opportunity for data-driven students.', 'Currently pursuing degree in Statistics/CS, SQL proficiency', 40000.00, 50000.00, 4),
('Marketing Coordinator', 'Startup XYZ', 'Remote', 'REMOTE', 'Help us grow our brand through creative marketing initiatives.', 'Marketing degree, social media experience', 50000.00, 70000.00, 4);

-- Insert sample events
INSERT INTO events (title, description, event_type, start_date, end_date, location, is_virtual, organizer_id, max_attendees)
VALUES 
('Annual Alumni Reunion 2024', 'Join us for our annual reunion to reconnect with classmates and network.', 'REUNION', '2024-06-15 18:00:00', '2024-06-15 22:00:00', 'University Grand Hall', FALSE, 1, 500),
('Tech Career Workshop', 'Learn about career opportunities in tech from industry professionals.', 'WORKSHOP', '2024-05-20 14:00:00', '2024-05-20 17:00:00', 'Online', TRUE, 2, 100),
('Networking Mixer', 'Casual networking event for students and alumni.', 'NETWORKING', '2024-05-25 19:00:00', '2024-05-25 21:00:00', 'Campus Center', FALSE, 1, 150);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, link)
VALUES 
(5, 'JOB', 'New Job Posted', 'A new Software Engineer position at Google has been posted.', '/student/jobs'),
(5, 'EVENT', 'Upcoming Event', 'Don''t forget about the Tech Career Workshop tomorrow!', '/student/events'),
(2, 'MENTORSHIP', 'New Mentorship Request', 'You have a new mentorship request from Alice Williams.', '/alumni/mentorship');
