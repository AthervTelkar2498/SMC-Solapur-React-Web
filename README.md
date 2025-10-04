# Solapur Municipal Corporation - Work Management System

A comprehensive web application built with React.js, Node.js, and PostgreSQL for managing work proposals and tracking their status for Solapur Municipal Corporation.

## Features

- 🔐 **Secure Admin Authentication** - Login system with JWT tokens
- 📊 **Interactive Dashboard** - Real-time statistics and data visualization
- 📄 **Excel Upload & Processing** - Batch upload of work proposals from Excel files
- 📋 **Data Management** - View, filter, and manage work proposals with status tracking
- 📈 **Analytics & Reports** - Charts and graphs for performance monitoring
- 🔍 **Advanced Search & Filtering** - Find specific proposals quickly
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Technology Stack

### Frontend
- React.js 18
- Styled Components for styling
- Recharts for data visualization
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT authentication
- Multer for file uploads
- XLSX for Excel processing

## Project Structure

```
solapur-municipal-work-management/
├── backend/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth and other middleware
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded Excel files
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # Styled components
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd solapur-municipal-work-management
   ```

2. **Install dependencies for all modules**
   ```bash
   npm run install-all
   ```

3. **Set up PostgreSQL Database**
   
   Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE solapur_municipal;
   CREATE USER postgres WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE solapur_municipal TO postgres;
   ```

4. **Configure Environment Variables**
   
   Create `.env` file in the backend directory:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=solapur_municipal
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   MAX_FILE_SIZE=10485760
   ```

5. **Start the Application**
   
   Start both backend and frontend simultaneously:
   ```bash
   npm run dev
   ```
   
   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Create Admin User**
   
   After starting the backend, create an admin user by making a POST request:
   ```bash
   curl -X POST http://localhost:5000/api/auth/setup-admin \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "admin123"}'
   ```

## Usage

### Admin Login
- Navigate to `http://localhost:3000/login`
- Use default credentials: `admin` / `admin123`

### Excel File Upload
1. Go to the Dashboard or Upload Excel section
2. Click "Upload Excel" button
3. Select your Excel file (.xlsx or .xls)
4. The system will process and import the data

### Excel File Format
The Excel file should contain the following columns:
- Sr. No.
- Proposal Number
- Proposal Code
- Transaction Date
- Service Name
- Owner Name
- Site Address
- Pending By
- Designation
- Application Received Date

### Dashboard Features
- **Statistics Cards**: View total, pending, completed, and overdue work
- **Charts**: Visual representation of work status and trends
- **Data Table**: Searchable and filterable list of all proposals
- **Status Management**: Update work status (Pending/Completed/Overdue)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/setup-admin` - Create admin user
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/performance` - Get performance metrics
- `GET /api/dashboard/alerts` - Get system alerts

### Proposals
- `GET /api/proposals` - Get all proposals with filtering
- `GET /api/proposals/:id` - Get proposal by ID
- `PATCH /api/proposals/:id/status` - Update proposal status
- `DELETE /api/proposals/:id` - Delete proposal
- `PATCH /api/proposals/bulk/status` - Bulk update status

### File Upload
- `POST /api/upload/excel` - Upload Excel file
- `GET /api/upload/history` - Get upload history

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Proposals Table
```sql
CREATE TABLE proposals (
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
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the ISC License.

---

**Built for Solapur Municipal Corporation with ❤️**