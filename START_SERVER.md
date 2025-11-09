# 🚀 How to Start the Servers

## ⚠️ IMPORTANT: Registration Failed Error Fix

If you're seeing "Registration failed" error, it's likely because **the backend server is not running**.

## 📋 Step-by-Step Instructions

### 1. Start the Backend Server (REQUIRED)

Open a terminal/command prompt and run:

```bash
cd server
npm start
```

You should see:
```
📊 Database Configuration:
   Server: INAYAT-RAHIM
   Database: Educurator
   User: sa
   Password: ***

Connected to MSSQL Server
Server is running on port 5000
Environment: development
```

### 2. Start the Frontend Server

Open another terminal/command prompt and run:

```bash
cd client
npm start
```

The browser should automatically open to `http://localhost:3000`

## ✅ Verify Servers Are Running

### Backend Server
- Open browser: `http://localhost:5000/api/health`
- You should see: `{"success":true,"message":"Server is running",...}`

### Frontend Server
- Open browser: `http://localhost:3000`
- You should see the Educurator homepage

## 🔧 Troubleshooting

### Error: "Registration failed" or "Cannot connect to server"

**Solution:**
1. ✅ Make sure the backend server is running on port 5000
2. ✅ Check if port 5000 is already in use
3. ✅ Verify the database is set up correctly
4. ✅ Check the backend server logs for errors

### Error: "Database connection error"

**Solution:**
1. ✅ Make sure SQL Server is running
2. ✅ Verify database credentials in `.env` file
3. ✅ Run database setup: `npm run init-db`

### Error: "Port 5000 already in use"

**Solution:**
1. Find the process using port 5000
2. Kill the process or change the PORT in `.env` file

## 📝 Quick Start Commands

### Windows (PowerShell)
```powershell
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

### Mac/Linux
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

## 🎯 Testing Registration

Once both servers are running:

1. Go to `http://localhost:3000/register`
2. Fill in the registration form
3. Click "Register"
4. You should be redirected to the dashboard ✅

## 📞 Need Help?

If you still see errors:
1. Check the browser console (F12)
2. Check the backend server logs
3. Verify both servers are running
4. Check the database connection

---

**Remember: Both servers must be running for the application to work!** 🚀

