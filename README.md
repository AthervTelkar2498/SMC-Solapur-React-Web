# Solapur Municipal Corporation - Work Management System

A comprehensive work management system for Solapur Municipal Corporation to track and manage building permission proposals and municipal work.

## 🚀 Features

- **Admin Login System** - Secure authentication for administrators
- **Excel Upload** - Upload Excel sheets with proposal data
- **Dashboard Analytics** - View statistics, charts, and graphs
- **Work Tracking** - Track pending, completed, and overdue work
- **Person-wise Tracking** - Monitor work status by assigned personnel
- **Batch Upload Support** - Handle multiple Excel uploads (every 60 days)
- **Real-time Status Updates** - Automatic status calculation based on pending days
- **Beautiful UI** - Modern, responsive design matching municipal standards

## 📋 System Requirements

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Database Setup

Install PostgreSQL and create the database:

```bash
# Login to PostgreSQL
psql -U postgres

# Run the initialization script
\i backend/config/init-db.sql
```

Or manually create the database:

```bash
createdb solapur_municipal
psql -U postgres -d solapur_municipal -f backend/config/init-db.sql
```

### 3. Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Login Credentials

```
Username: admin
Password: admin123
```

**⚠️ Important:** Change the default password after first login in production!

## 📊 Excel File Format

The system expects Excel files with the following columns:

| Column Name | Description | Required |
|------------|-------------|----------|
| Sr No. | Serial Number | Yes |
| Proposal Number | Unique proposal identifier | Yes |
| Proposal Code | Proposal code (e.g., DDMCS-24-ENTRY-112731) | Yes |
| Transaction Date | Date of transaction | Yes |
| Service Name | Type of service (e.g., Building Permission) | Yes |
| Owner Name | Name of the property owner | Yes |
| Site Address | Address of the site | Yes |
| Pending By | Name of person with pending work | Yes |
| Designation | Designation of the person | Yes |
| Application Received Date | Date application was received | Yes |
| Days | Number of days pending | Yes |

### Sample Excel Structure

See the third image in the project for the exact format. The system supports multiple sheets in one Excel file (e.g., Municipal Commissioner, Deputy Director sheets).

## 📁 Project Structure

```
solapur-municipal-corporation/
├── backend/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   └── init-db.sql          # Database schema
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Login/Register routes
│   │   ├── dashboard.js         # Dashboard statistics
│   │   ├── proposals.js         # Proposals CRUD
│   │   └── upload.js            # Excel upload handling
│   ├── uploads/                 # Uploaded files directory
│   ├── .env                     # Environment variables
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Login.css
│   │   │   ├── Dashboard.js     # Dashboard page
│   │   │   └── Dashboard.css
│   │   ├── App.js               # Main app component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json             # Frontend dependencies
└── README.md                    # This file
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent` - Get recent proposals

### Proposals
- `GET /api/proposals` - Get all proposals (with filters)
- `GET /api/proposals/:id` - Get single proposal
- `PUT /api/proposals/:id` - Update proposal status

### Upload
- `POST /api/upload/excel` - Upload Excel file

## 💾 Database Schema

### Users Table
- id, username, password, full_name, role, created_at

### Proposals Table
- id, sr_no, proposal_number, proposal_code, transaction_date
- service_name, owner_name, site_address, pending_by, designation
- application_received_date, days_pending, status, upload_batch_id
- uploaded_at, created_at

### Upload Batches Table
- id, batch_id, filename, upload_date, total_records, status

## 🎨 Dashboard Features

1. **Statistics Cards**
   - Total Proposals
   - Completed Work
   - Pending Work
   - Average Day Count

2. **Task Status Overview** (Pie Chart)
   - Visual representation of work status

3. **Tasks Over Time** (Line Chart)
   - Trend analysis of work completion

4. **Proposals Table**
   - Searchable and filterable
   - Status badges (Completed, Pending, Overdue)

## 🔧 Configuration

### Backend Configuration (.env)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=solapur_municipal
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

### Status Logic

- **Completed**: Days pending = 0 or manually marked complete
- **Pending**: Days pending between 1-30
- **Overdue**: Days pending > 30

## 🚀 Deployment

### Backend Deployment

1. Set up PostgreSQL on your server
2. Configure environment variables
3. Run database migrations
4. Start the server with `npm start` or use PM2

```bash
pm2 start server.js --name solapur-backend
```

### Frontend Deployment

1. Build the React app:
```bash
cd frontend
npm run build
```

2. Serve the build folder using nginx or any static file server

### Production Checklist

- [ ] Change default admin password
- [ ] Update JWT secret key
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure database backups
- [ ] Set up monitoring and logging

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- File upload validation
- SQL injection prevention with parameterized queries

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Excel Upload Issues
- Ensure Excel file follows the correct format
- Check file size is under 10MB
- Verify all required columns are present

## 📝 License

This project is proprietary software developed for Solapur Municipal Corporation.

## 👥 Support

For issues and support, contact the development team.

---

**Built with ❤️ for Solapur Municipal Corporation**
