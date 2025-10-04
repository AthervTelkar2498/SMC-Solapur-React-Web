# Deployment Guide - Solapur Municipal Corporation

This guide covers deploying the Work Management System to a production environment.

## 🖥️ Server Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB
- **OS**: Ubuntu 20.04 LTS or higher

### Recommended Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **OS**: Ubuntu 22.04 LTS

## 📦 Prerequisites

Install required software:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 14
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

## 🗄️ Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE solapur_municipal;
CREATE USER smc_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE solapur_municipal TO smc_user;
\q

# Initialize database
psql -U smc_user -d solapur_municipal -f /path/to/backend/config/init-db.sql
```

## 🔧 Backend Deployment

### 1. Clone Repository

```bash
cd /var/www
sudo git clone <repository-url> solapur-municipal
cd solapur-municipal/backend
```

### 2. Configure Environment

```bash
# Create production environment file
sudo nano .env
```

Add:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=solapur_municipal
DB_USER=smc_user
DB_PASSWORD=your_secure_password
JWT_SECRET=generate_a_very_secure_random_key_here
NODE_ENV=production
```

### 3. Install Dependencies

```bash
sudo npm install --production
```

### 4. Start with PM2

```bash
# Start the backend
pm2 start server.js --name solapur-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🎨 Frontend Deployment

### 1. Build React App

```bash
cd /var/www/solapur-municipal/frontend

# Install dependencies
sudo npm install

# Create production build
sudo npm run build
```

### 2. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/solapur-municipal
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/solapur-municipal/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File uploads
    client_max_body_size 10M;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/solapur-municipal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 SSL Certificate (HTTPS)

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up by default
# Test renewal
sudo certbot renew --dry-run
```

## 🔥 Firewall Configuration

```bash
# Allow necessary ports
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## 📊 Monitoring and Logs

### PM2 Monitoring

```bash
# View logs
pm2 logs solapur-backend

# Monitor processes
pm2 monit

# View process list
pm2 list
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL Logs

```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

## 🔄 Update Deployment

```bash
cd /var/www/solapur-municipal

# Pull latest changes
sudo git pull origin main

# Update backend
cd backend
sudo npm install --production
pm2 restart solapur-backend

# Update frontend
cd ../frontend
sudo npm install
sudo npm run build

# Restart Nginx
sudo systemctl restart nginx
```

## 🗄️ Database Backup

### Manual Backup

```bash
# Backup database
pg_dump -U smc_user solapur_municipal > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U smc_user solapur_municipal < backup_file.sql
```

### Automated Daily Backup

Create backup script:
```bash
sudo nano /usr/local/bin/backup-solapur-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/solapur-municipal"
mkdir -p $BACKUP_DIR
pg_dump -U smc_user solapur_municipal | gzip > $BACKUP_DIR/db_$(date +%Y%m%d_%H%M%S).sql.gz
# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

Make executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/backup-solapur-db.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-solapur-db.sh
```

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall (UFW)
- [ ] Set up database backups
- [ ] Restrict database access
- [ ] Use environment variables for secrets
- [ ] Keep system and packages updated
- [ ] Monitor logs regularly
- [ ] Set up fail2ban for SSH protection

### Install fail2ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📈 Performance Optimization

### 1. PM2 Cluster Mode

```bash
pm2 start server.js --name solapur-backend -i max
```

### 2. Nginx Caching

Add to nginx config:
```nginx
# Cache static files
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. PostgreSQL Tuning

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Adjust based on your RAM:
```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 4MB
```

## 🆘 Troubleshooting

### Backend Not Starting

```bash
pm2 logs solapur-backend
# Check for errors in logs
```

### Database Connection Issues

```bash
# Test connection
psql -U smc_user -d solapur_municipal -h localhost
```

### Nginx 502 Bad Gateway

```bash
# Check if backend is running
pm2 list

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support

For production issues, contact your system administrator or development team.

---

**Last Updated**: 2025-10-04
