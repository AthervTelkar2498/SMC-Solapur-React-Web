#!/bin/bash

echo "🚀 Setting up Solapur Municipal Corporation Work Management System"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ and try again."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ All dependencies installed successfully"

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "⚙️ Creating backend environment configuration..."
    cp backend/.env.example backend/.env
    echo "✅ Please update backend/.env with your database credentials"
fi

# Create database setup script
cat > setup-database.sql << EOF
-- Create database and user for Solapur Municipal Corporation
CREATE DATABASE IF NOT EXISTS solapur_municipal;
CREATE USER IF NOT EXISTS postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE solapur_municipal TO postgres;

-- Use the database
\c solapur_municipal;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_batch ON proposals(batch_id);
CREATE INDEX IF NOT EXISTS idx_proposals_upload_date ON proposals(upload_date);
EOF

echo "📊 Database setup script created: setup-database.sql"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database:"
echo "   psql -U postgres < setup-database.sql"
echo ""
echo "2. Update backend/.env with your database credentials"
echo ""
echo "3. Start the application:"
echo "   npm run dev"
echo ""
echo "4. Create admin user (after starting the backend):"
echo "   curl -X POST http://localhost:5000/api/auth/setup-admin -H \"Content-Type: application/json\" -d '{\"username\": \"admin\", \"password\": \"admin123\"}'"
echo ""
echo "5. Access the application at http://localhost:3000"
echo ""
echo "Happy coding! 🚀"