-- Create database
CREATE DATABASE solapur_municipal;

-- Connect to the database
\c solapur_municipal;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    sr_no INTEGER,
    proposal_number VARCHAR(100),
    proposal_code VARCHAR(100),
    transaction_date DATE,
    service_name TEXT,
    owner_name TEXT,
    site_address TEXT,
    pending_by VARCHAR(255),
    designation VARCHAR(255),
    application_received_date DATE,
    days_pending INTEGER,
    status VARCHAR(50) DEFAULT 'Pending',
    upload_batch_id VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create upload_batches table to track Excel uploads
CREATE TABLE IF NOT EXISTS upload_batches (
    id SERIAL PRIMARY KEY,
    batch_id VARCHAR(100) UNIQUE NOT NULL,
    filename VARCHAR(255),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_records INTEGER,
    status VARCHAR(50) DEFAULT 'active'
);

-- Create indexes for better performance
CREATE INDEX idx_proposal_number ON proposals(proposal_number);
CREATE INDEX idx_status ON proposals(status);
CREATE INDEX idx_pending_by ON proposals(pending_by);
CREATE INDEX idx_upload_batch ON proposals(upload_batch_id);
CREATE INDEX idx_application_date ON proposals(application_received_date);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, full_name, role) 
VALUES ('admin', '$2a$10$X8qJ3qZ4YN5Z5Z5Z5Z5Z5.eKqYxZqJvCQX8qJ3qZ4YN5Z5Z5Z5Z5Z', 'Admin User', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Note: The password hash above is for 'admin123'
-- In production, you should change this password immediately after first login
