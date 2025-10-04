# Frontend - Solapur Municipal Corporation

React-based frontend for the Work Management System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── pages/
│   │   ├── Login.js          # Login page
│   │   ├── Login.css
│   │   ├── Dashboard.js      # Main dashboard
│   │   └── Dashboard.css
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── App.js                # Main app component
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 🎨 Pages

### Login Page
- Beautiful gradient background
- Logo and branding
- Language toggle (English/मराठी)
- Form validation
- Error handling

**Route**: `/login`

### Dashboard Page
- Statistics cards
- Excel upload functionality
- Data table with search and filters
- Pie chart (Task Status Overview)
- Line chart (Tasks Over Time)
- Sidebar navigation

**Route**: `/dashboard`

## 🔧 Components

### Login Component
```jsx
import Login from './pages/Login';
<Login onLogin={handleLogin} />
```

### Dashboard Component
```jsx
import Dashboard from './pages/Dashboard';
<Dashboard onLogout={handleLogout} />
```

## 🌐 API Integration

All API calls are handled through `services/api.js`:

```javascript
import { authAPI, dashboardAPI, proposalsAPI, uploadAPI } from './services/api';

// Login
const response = await authAPI.login({ username, password });

// Get dashboard stats
const stats = await dashboardAPI.getStats();

// Upload Excel
const formData = new FormData();
formData.append('file', file);
await uploadAPI.uploadExcel(formData);
```

## 🎨 Styling

- CSS Modules for component-specific styles
- Color scheme based on municipal branding
- Responsive design for mobile and desktop
- Modern UI with gradients and shadows

### Color Palette
```css
--primary-blue: #4a90e2;
--secondary-blue: #667eea;
--dark-blue: #2c3e50;
--light-blue: #e8f4f8;
--red: #e74c3c;
--orange: #f39c12;
--green: #27ae60;
```

## 📊 Charts

Using **Recharts** library for data visualization:

### Pie Chart
```jsx
<PieChart>
  <Pie data={pieData} innerRadius={60} outerRadius={80} />
</PieChart>
```

### Line Chart
```jsx
<LineChart data={lineData}>
  <Line type="monotone" dataKey="value" stroke="#4a90e2" />
</LineChart>
```

## 🔐 Authentication

Token-based authentication:

```javascript
// Store token after login
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Remove on logout
localStorage.removeItem('token');
localStorage.removeItem('user');

// Redirect to login if unauthorized
if (error.response?.status === 401) {
  window.location.href = '/login';
}
```

## 📱 Responsive Design

Breakpoints:
- Desktop: > 1400px
- Tablet: 768px - 1400px
- Mobile: < 768px

## 🔄 State Management

Using React hooks:
- `useState` for local state
- `useEffect` for data fetching
- `localStorage` for persistence

## 🎯 Features

1. **Admin Login**
   - Secure authentication
   - Remember credentials
   - Forgot password link

2. **Dashboard**
   - Real-time statistics
   - Excel file upload
   - Search and filter proposals
   - Visual charts and graphs
   - Responsive table

3. **Excel Upload**
   - Drag and drop support
   - File validation
   - Progress indication
   - Success/error feedback

4. **Data Table**
   - Sortable columns
   - Search functionality
   - Status badges
   - Pagination

## 🚀 Build and Deploy

### Development Build
```bash
npm start
# Opens http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates optimized build in /build directory
```

### Deployment
The build folder can be deployed to:
- Nginx
- Apache
- Vercel
- Netlify
- GitHub Pages

Example nginx config:
```nginx
location / {
    root /var/www/solapur-municipal/frontend/build;
    try_files $uri /index.html;
}
```

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies

### Core
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.20.1

### UI/Charts
- `recharts`: ^2.10.3

### HTTP
- `axios`: ^1.6.2

### Build
- `react-scripts`: 5.0.1

## 🔧 Configuration

### Proxy Setup
Backend API proxy is configured in `package.json`:
```json
{
  "proxy": "http://localhost:5000"
}
```

### Environment Variables
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Common Issues

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

For more information, see the main README.md in the project root.
