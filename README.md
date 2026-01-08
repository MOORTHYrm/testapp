# User Management Application - Complete Deployment

## 🏗️ Architecture
- **Frontend**: Node.js/Express (Port 80) with CORS
- **Backend**: Node.js/Express REST API (Port 3000) with CORS
- **Database**: AWS Aurora PostgreSQL
- **Containerization**: Docker + Docker Compose

## 🚀 Quick Start

### 1. Start Application
```bash
cd ~/myapp
docker-compose up -d
```

### 2. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. Check Status
```bash
docker-compose ps
```

### 4. Stop Application
```bash
docker-compose down
```

### 5. Restart Services
```bash
docker-compose restart
```

### 6. Rebuild from Scratch
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🌐 Access Application

### Via EC2 Public IP
```bash
# Frontend
http://YOUR_EC2_PUBLIC_IP

# Backend API
http://YOUR_EC2_PUBLIC_IP:3000/api/users

# Health Checks
http://YOUR_EC2_PUBLIC_IP/health
http://YOUR_EC2_PUBLIC_IP:3000/health
```

### Test Endpoints
```bash
# Frontend health
curl http://localhost/health

# Backend health
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

## 🔒 Security Groups Configuration

### EC2 Security Group (Inbound Rules)
| Type | Port | Source | Description |
|------|------|--------|-------------|
| HTTP | 80 | 0.0.0.0/0 | Frontend |
| Custom TCP | 3000 | 0.0.0.0/0 | Backend API |
| SSH | 22 | Your IP | SSH Access |

### Aurora Security Group (Inbound Rules)
| Type | Port | Source | Description |
|------|------|--------|-------------|
| PostgreSQL | 5432 | EC2 Security Group | Database |

## 🗄️ Database Configuration
- **Cluster**: Clusterendpoint
- **Database**: testdb
- **Port**: 5432
- **Table**: users (auto-created)

## 🔧 Troubleshooting

### Check Container Status
```bash
docker-compose ps
```

### View Real-time Logs
```bash
docker-compose logs -f backend
```

### Access Container Shell
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh
```

### Test Database Connection
```bash
docker-compose exec backend sh
wget -O- http://localhost:3000/health
```

### Common Issues

#### CORS Error
✅ Already fixed with CORS middleware in both frontend and backend

#### Cannot Connect to Database
```bash
# Check database credentials in docker-compose.yml
# Verify Aurora security group allows EC2 connection
# Check backend logs
docker-compose logs backend
```

#### Port Already in Use
```bash
# Find process using port 80
sudo lsof -i :80
sudo kill -9 <PID>

# Find process using port 3000
sudo lsof -i :3000
sudo kill -9 <PID>
```

#### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

## 📊 Monitoring

### View Resource Usage
```bash
docker stats
```

### Check Health Status
```bash
# Frontend
curl http://localhost/health

# Backend
curl http://localhost:3000/health

# API
curl http://localhost:3000/api/users
```

## 🔄 Update Application

### Update Code
```bash
cd ~/myapp

# Edit files as needed
nano frontend/index.html
nano backend/server.js

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

## 📝 Key Features Implemented

✅ CORS enabled on both frontend and backend
✅ Connection status indicator in UI
✅ Debug information panel
✅ Automatic database table creation
✅ Health check endpoints
✅ Error handling and logging
✅ Auto-restart on failure
✅ Docker containerization

## 🎯 Environment Variables

Edit `docker-compose.yml` to change database credentials:
```yaml
environment:
  - DB_HOST=your-aurora-endpoint
  - DB_PORT=5432
  - DB_NAME=your-database
  - DB_USER=your-username
  - DB_PASSWORD=your-password
```

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check container logs: `docker-compose logs -f`
3. Verify security groups
4. Test database connection
5. Ensure ports 80 and 3000 are not blocked
