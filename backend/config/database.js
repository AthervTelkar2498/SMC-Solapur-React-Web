const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'solapur_municipal',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Create tables if they don't exist
const createTables = async () => {
  try {
    // Users table for admin authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Proposals table to store all work proposals
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id SERIAL PRIMARY KEY,
        sr_no INTEGER,
        proposal_number VARCHAR(100),
        proposal_code VARCHAR(100),
        transaction_date DATE,
        service_name VARCHAR(500),
        owner_name VARCHAR(255),
        site_address TEXT,
        pending_by VARCHAR(255),
        designation VARCHAR(255),
        application_received_date DATE,
        days_pending INTEGER,
        status VARCHAR(50) DEFAULT 'pending',
        batch_id VARCHAR(100),
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
      CREATE INDEX IF NOT EXISTS idx_proposals_batch ON proposals(batch_id);
      CREATE INDEX IF NOT EXISTS idx_proposals_upload_date ON proposals(upload_date);
    `);

    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

module.exports = {
  pool,
  createTables
};