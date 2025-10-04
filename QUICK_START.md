# Quick Start Guide - Solapur Municipal Corporation

Get up and running in 5 minutes!

## ⚡ Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js (v14+) installed
- [ ] PostgreSQL (v12+) installed
- [ ] Git installed

**Quick Check:**
```bash
node -v    # Should show v14 or higher
npm -v     # Should show npm version
psql --version  # Should show PostgreSQL version
```

## 🚀 Installation (Automated)

### Option 1: Automated Setup Script (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd solapur-municipal-corporation

# Run automated setup
./setup.sh
```

The script will:
1. ✅ Check prerequisites
2. ✅ Create PostgreSQL database
3. ✅ Install backend dependencies
4. ✅ Install frontend dependencies
5. ✅ Configure environment variables

## 🎯 Manual Setup

### Option 2: Manual Installation

#### Step 1: Database Setup (2 minutes)

```bash
# Create database
createdb solapur_municipal

# Initialize schema
psql -U postgres -d solapur_municipal -f backend/config/init-db.sql
```

#### Step 2: Backend Setup (1 minute)

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=solapur_municipal
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_secret_key_here
EOF
```

#### Step 3: Frontend Setup (1 minute)

```bash
cd frontend
npm install
```

## ▶️ Running the Application

### Start Both Servers (Automated)

```bash
# From project root
./start.sh
```

### Start Servers Manually

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## 🌐 Access the Application

1. **Open Browser**: http://localhost:3000
2. **Login** with default credentials:
   - Username: `admin`
   - Password: `admin123`

## 📤 First Upload

1. Navigate to Dashboard
2. Click "Upload Excel" button
3. Select your Excel file
4. Wait for success message
5. View data in table

## 📋 Excel File Format

Your Excel must have these columns:
1. Sr No.
2. Proposal Number
3. Proposal Code
4. Transaction Date
5. Service Name
6. Owner Name
7. Site Address
8. Pending By
9. Designation
10. Application Received Date
11. Days

See `EXCEL_FORMAT_GUIDE.md` for detailed format.

## ✅ Verify Installation

### Backend Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"..."}
```

### Frontend Check
Open http://localhost:3000 - Should see login page

### Database Check
```bash
psql -U postgres -d solapur_municipal -c "SELECT COUNT(*) FROM users;"
# Should return: 1 (default admin user)
```

## 🎨 What You'll See

### Login Page
- Clean white card on gradient background
- SM logo
- Username and password fields
- "Forgot Password?" link
- Language toggle (English/मराठी)

### Dashboard
- 5 Statistics cards (Total, Completed, Pending, etc.)
- Upload Excel button
- Data table with search
- Pie chart (Task Status)
- Line chart (Tasks Over Time)
- Sidebar navigation

## 🔧 Common Issues

### Port Already in Use

**Problem**: Error: Port 3000/5000 already in use

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database Connection Failed

**Problem**: Error connecting to database

**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Verify credentials in backend/.env
```

### Module Not Found

**Problem**: Error: Cannot find module

**Solution**:
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

## 📚 Next Steps

1. **Change Password**: Update admin password
2. **Upload Data**: Upload your first Excel file
3. **Explore Dashboard**: Check statistics and charts
4. **Review Docs**: Read full README.md

## 🎓 Quick Tutorial

### 1. Login
- Open http://localhost:3000
- Enter: admin / admin123
- Click "Login"

### 2. View Dashboard
- See statistics: Total Proposals, Completed Work, etc.
- View charts on the right
- Browse data table at bottom

### 3. Upload Excel
- Click "Upload Excel" button
- Select `.xlsx` file
- Wait for "File uploaded successfully!" message
- Data appears in table

### 4. Search & Filter
- Use search box to find proposals
- Use status filter dropdown
- Click "Filter" button

### 5. Logout
- Click "Logout" button in top right

## 🆘 Need Help?

1. **Check Logs**:
   - Backend: Check terminal running backend
   - Frontend: Check browser console (F12)

2. **Review Documentation**:
   - `README.md` - Full documentation
   - `EXCEL_FORMAT_GUIDE.md` - Excel format
   - `DEPLOYMENT.md` - Production deployment
   - `backend/README.md` - API docs
   - `frontend/README.md` - Frontend docs

3. **Common Commands**:
```bash
# View backend logs
cd backend && npm start

# View database
psql -U postgres -d solapur_municipal

# Rebuild frontend
cd frontend && npm run build

# Check running processes
ps aux | grep node
```

## 🎉 You're All Set!

The system is now ready to use. Start uploading your Excel files and tracking municipal work!

**Default URLs**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

**Default Credentials**:
- Username: admin
- Password: admin123

⚠️ **Remember to change the default password!**

---

**Questions?** Check README.md or contact your administrator.

**Ready for Production?** See DEPLOYMENT.md
