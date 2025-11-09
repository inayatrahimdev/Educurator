# Educurator - Personalized Educational Platform

A modern, production-ready, end-to-end personalized educational web application built with React, Node.js, Express, and MSSQL Server.

## Features

### Frontend
- **React 18** with React Router for navigation
- **Material-UI (MUI)** for modern, responsive UI components
- **Redux Toolkit** for state management
- **Personalized Dashboard** with course recommendations based on user preferences and progress
- **Course Management** with detailed course pages and module viewing
- **User Profile** with progress tracking and notifications
- **Authentication** with JWT tokens

### Backend
- **Node.js** with Express.js REST API
- **JWT Authentication** with token-based security
- **MSSQL Server** database integration
- **Password Hashing** with bcrypt
- **Input Validation** with express-validator
- **Security Middleware** (Helmet, CORS)
- **Error Handling** with centralized error handler
- **Logging** with Morgan

### Database
- **MSSQL Server** with comprehensive schema
- **User Management** with preferences storage
- **Course & Module** management
- **Progress Tracking** for enrolled courses
- **Notifications** system

## Project Structure

```
Educurator/
├── client/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API service layer
│   │   ├── theme/         # Material-UI theme configuration
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware (auth, error handling)
│   ├── routes/           # API routes
│   ├── db.js             # Database connection module
│   ├── server.js         # Express server setup
│   └── package.json
├── database/              # Database scripts
│   └── schema.sql        # Database schema and sample data
└── README.md
```

## Prerequisites

- **Node.js** (v16 or higher)
- **MSSQL Server** (2012 or higher)
- **npm** or **yarn**

## Installation & Setup

### 1. Database Setup

1. Install and configure MSSQL Server on your machine
2. Open SQL Server Management Studio (SSMS)
3. Run the database schema script:
   ```sql
   -- Create database
   CREATE DATABASE Educurator;
   GO
   USE Educurator;
   GO
   ```
4. Execute the `database/schema.sql` file to create tables and insert sample data

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The `.env` file is already created with your database credentials
   - Update if needed:
     ```env
     DB_USER=sa
     DB_PASS=inayat12
     DB_SERVER=INAYAT-RAHIM
     DB_NAME=Educurator
     JWT_SECRET=your-secret-key-here
     PORT=5000
     ```

4. Start the backend server:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Courses
- `GET /api/courses` - Get all courses (with optional search/tags query params)
- `GET /api/courses/:id` - Get course by ID (Protected)
- `GET /api/courses/recommendations/list` - Get personalized recommendations (Protected)
- `POST /api/courses` - Create a new course (Protected)
- `PUT /api/courses/:id` - Update course (Protected)
- `DELETE /api/courses/:id` - Delete course (Protected)
- `POST /api/courses/:id/enroll` - Enroll in a course (Protected)
- `PUT /api/courses/:id/progress` - Update course progress (Protected)

### Modules
- `POST /api/modules/courses/:courseId/modules` - Create a module (Protected)
- `PUT /api/modules/:id` - Update module (Protected)
- `DELETE /api/modules/:id` - Delete module (Protected)

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users/progress` - Get user progress (Protected)
- `GET /api/users/notifications` - Get user notifications (Protected)
- `PUT /api/users/notifications/:id/read` - Mark notification as read (Protected)

## Database Schema

### Tables

1. **Users** - User accounts with preferences
   - id, name, email, password, preferences (JSON), createdAt, updatedAt

2. **Courses** - Course information
   - id, title, description, tags (JSON), createdAt, updatedAt

3. **Modules** - Course modules/lessons
   - id, courseId, title, content, orderIndex, createdAt, updatedAt

4. **UserCourses** - User enrollment and progress
   - id, userId, courseId, progress, lastVisited, enrolledAt

5. **Notifications** - User notifications
   - id, userId, message, status, createdAt

## Authentication Flow

1. User registers/logs in with email and password
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Token is sent with each request in Authorization header: `Bearer <token>`
5. Token expires after 1 hour
6. Protected routes verify token before processing requests

## Key Features

### Personalized Dashboard
- Displays user's enrolled courses with progress
- Shows recommended courses based on:
  - User preferences (interests, difficulty)
  - User progress in enrolled courses
  - Course tags matching user interests

### Course Management
- Browse all available courses
- Search courses by title/description
- View detailed course information
- Enroll in courses
- Track progress through modules
- Mark modules as complete

### User Profile
- View and edit profile information
- Manage preferences (interests, difficulty, language)
- View learning progress across all enrolled courses
- Manage notifications

## Security Features

- **JWT Tokens** for secure authentication
- **Password Hashing** with bcrypt
- **Helmet** for HTTP header security
- **CORS** configuration for cross-origin requests
- **Input Validation** with express-validator
- **Error Handling** to prevent information leakage
- **SQL Injection Protection** using parameterized queries

## Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

**Frontend:**
```bash
cd client
npm start  # React development server with hot-reload
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

The build folder will contain the optimized production build.

## Environment Variables

### Backend (.env)
- `DB_USER` - MSSQL Server username
- `DB_PASS` - MSSQL Server password
- `DB_SERVER` - MSSQL Server hostname
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 5000)

## Troubleshooting

### Database Connection Issues
- Verify MSSQL Server is running
- Check database credentials in `.env`
- Ensure SQL Server Authentication is enabled
- Verify TCP/IP protocol is enabled in SQL Server Configuration Manager

### CORS Issues
- Ensure backend CORS configuration includes frontend URL
- Check that frontend proxy is configured in `package.json`

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token expiration (1 hour)
- Ensure Authorization header is included in requests

## Future Enhancements

- [ ] Admin panel for course management
- [ ] Video/audio content support
- [ ] Quiz and assessment features
- [ ] Certificate generation
- [ ] Email notifications
- [ ] Social features (comments, discussions)
- [ ] Mobile app support
- [ ] Payment integration
- [ ] Analytics dashboard

## License

This project is licensed under the ISC License.

## Contributors

- Your Name

## Support

For issues and questions, please open an issue on the repository.




