# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js (v16+) installed
- [ ] MSSQL Server installed and running
- [ ] SQL Server Authentication enabled
- [ ] TCP/IP protocol enabled in SQL Server Configuration Manager

## Step-by-Step Setup

### 1. Database Setup (5 minutes)

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Create the database:
   ```sql
   CREATE DATABASE Educurator;
   GO
   ```
4. Open and execute `database/schema.sql` file
   - This creates all tables and inserts sample data
5. Verify tables were created:
   ```sql
   USE Educurator;
   SELECT * FROM INFORMATION_SCHEMA.TABLES;
   ```

### 2. Backend Setup (3 minutes)

1. Open terminal in project root
2. Navigate to server folder:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Verify `.env` file exists with correct credentials:
   ```
   DB_USER=sa
   DB_PASS=inayat12
   DB_SERVER=INAYAT-RAHIM
   DB_NAME=Educurator
   JWT_SECRET=d+hLV8Abn1sStl/nJkI/Ae4DETqSGnCfBXIODe028SE4k/5LBdyZ0istZv4tPV5lmbP4w4bAfSWPYMBpYy+YQw==
   PORT=5000
   ```
5. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
6. Verify server is running:
   - Open browser: `http://localhost:5000/api/health`
   - You should see: `{"success":true,"message":"Server is running",...}`

### 3. Frontend Setup (3 minutes)

1. Open a new terminal window
2. Navigate to client folder:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Browser should automatically open to `http://localhost:3000`

### 4. Test the Application

1. **Register a new user:**
   - Go to Register page
   - Fill in name, email, password
   - Click Register
   - You should be redirected to Dashboard

2. **View Dashboard:**
   - You should see recommended courses
   - Your progress section (empty initially)

3. **Browse Courses:**
   - Click on "Courses" in navbar
   - View available courses
   - Click on a course to see details

4. **Enroll in a Course:**
   - Open a course detail page
   - Click "Enroll in Course"
   - Return to Dashboard to see it in progress

5. **View Profile:**
   - Click on "Profile" in navbar
   - Edit your preferences
   - View your progress

## Troubleshooting

### Database Connection Issues

**Error: "Login failed for user"**
- Verify SQL Server Authentication is enabled
- Check username and password in `.env`
- Ensure user has access to the database

**Error: "Cannot connect to server"**
- Verify SQL Server is running
- Check server name in `.env` (should match your SQL Server instance name)
- Ensure TCP/IP protocol is enabled

**Error: "Certificate validation failed"**
- The `trustServerCertificate: true` option should handle this
- If still failing, verify SQL Server configuration

### Backend Issues

**Error: "Port already in use"**
- Change PORT in `.env` to a different port
- Or stop the process using port 5000

**Error: "Module not found"**
- Run `npm install` again in the server folder
- Delete `node_modules` and `package-lock.json`, then reinstall

### Frontend Issues

**Error: "Cannot connect to API"**
- Verify backend server is running on port 5000
- Check browser console for CORS errors
- Verify proxy setting in `client/package.json`

**Error: "Token expired"**
- Logout and login again
- Tokens expire after 1 hour

## Common Commands

### Backend
```bash
cd server
npm start          # Start server
npm run dev        # Start with auto-reload
npm install        # Install dependencies
```

### Frontend
```bash
cd client
npm start          # Start development server
npm run build      # Build for production
npm install        # Install dependencies
```

## Default Sample Data

The database schema includes sample courses:
- Introduction to Web Development
- Advanced React Development
- Node.js Backend Development
- Database Design and SQL
- Machine Learning Fundamentals

You can use these to test the application immediately after setup.

## Next Steps

1. Customize the theme in `client/src/theme/theme.js`
2. Add more courses through the API or directly in the database
3. Configure production environment variables
4. Set up deployment pipeline

## Support

If you encounter issues:
1. Check the README.md for detailed documentation
2. Verify all prerequisites are met
3. Check server logs for error messages
4. Verify database connection and credentials

