# Backend - Solapur Municipal Corporation API

Node.js backend API for the Work Management System.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Endpoints

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "Admin User",
    "role": "admin"
  }
}
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json
Authorization: Bearer {token}

{
  "username": "newuser",
  "password": "password123",
  "full_name": "New User",
  "role": "admin"
}
```

## 📊 Dashboard Endpoints

### Get Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "totalProposals": 450,
    "completedWork": 320,
    "pendingWork": 130,
    "avgDays": 60,
    "statusBreakdown": [...],
    "tasksOverTime": [...]
  }
}
```

### Get Recent Proposals
```http
GET /api/dashboard/recent?limit=10
Authorization: Bearer {token}
```

## 📝 Proposals Endpoints

### Get All Proposals
```http
GET /api/proposals?status=Pending&search=term&limit=50&offset=0
Authorization: Bearer {token}

Query Parameters:
- status: Filter by status (Completed, Pending, Overdue)
- pending_by: Filter by person name
- search: Search in proposal number, owner name, site address
- limit: Number of records (default: 100)
- offset: Pagination offset (default: 0)
```

### Get Single Proposal
```http
GET /api/proposals/:id
Authorization: Bearer {token}
```

### Update Proposal
```http
PUT /api/proposals/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Completed"
}
```

## 📤 Upload Endpoints

### Upload Excel File
```http
POST /api/upload/excel
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: Excel file (.xlsx, .xls, .csv)

Response:
{
  "success": true,
  "message": "Excel file uploaded and processed successfully",
  "batchId": "BATCH-1234567890",
  "recordsProcessed": 150
}
```

## 🗄️ Database Models

### Users
- `id`: Serial Primary Key
- `username`: String (unique)
- `password`: String (hashed)
- `full_name`: String
- `role`: String
- `created_at`: Timestamp

### Proposals
- `id`: Serial Primary Key
- `sr_no`: Integer
- `proposal_number`: String
- `proposal_code`: String
- `transaction_date`: Date
- `service_name`: Text
- `owner_name`: Text
- `site_address`: Text
- `pending_by`: String
- `designation`: String
- `application_received_date`: Date
- `days_pending`: Integer
- `status`: String (Completed, Pending, Overdue)
- `upload_batch_id`: String
- `uploaded_at`: Timestamp
- `created_at`: Timestamp

### Upload Batches
- `id`: Serial Primary Key
- `batch_id`: String (unique)
- `filename`: String
- `upload_date`: Timestamp
- `total_records`: Integer
- `status`: String

## 🔒 Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

Token expires in 24 hours.

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Error message"
}
```

### 401 Unauthorized
```json
{
  "error": "No token, authorization denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error",
  "message": "Detailed error message"
}
```

## 🚀 Running the Backend

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## 📝 Environment Variables

Required environment variables in `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=solapur_municipal
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

## 🔧 Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **xlsx**: Excel file parsing
- **dotenv**: Environment variables
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication

---

For more information, see the main README.md in the project root.
