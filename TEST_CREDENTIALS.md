# Test Credentials for Educurator

Use these test credentials to sign up and log in to the application.

## 🎯 Quick Test User (Recommended)

**Name:** John Doe  
**Email:** john.doe@example.com  
**Password:** password123

---

## 📋 All Test Users

### 1. John Doe
- **Name:** John Doe
- **Email:** john.doe@example.com
- **Password:** password123

### 2. Jane Smith
- **Name:** Jane Smith
- **Email:** jane.smith@example.com
- **Password:** securepass456

### 3. Bob Johnson
- **Name:** Bob Johnson
- **Email:** bob.johnson@example.com
- **Password:** mypassword789

### 4. Alice Williams
- **Name:** Alice Williams
- **Email:** alice.williams@example.com
- **Password:** testpass123

### 5. Charlie Brown
- **Name:** Charlie Brown
- **Email:** charlie.brown@example.com
- **Password:** password456

---

## 🚀 How to Use

### Option 1: Manual Registration (Recommended)

1. **Go to Registration Page:**
   - Open your browser
   - Navigate to `http://localhost:3000/register`

2. **Fill in the Form:**
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Password: `password123`
   - Confirm Password: `password123`

3. **Click Register:**
   - You should be redirected to the dashboard
   - Registration successful! ✅

4. **Logout and Test Login:**
   - Click logout
   - Go to login page
   - Use the same credentials to login

### Option 2: Automated Testing Script

Run the test script to automatically test registration and login:

```bash
cd server
npm run test-auth
```

Or:

```bash
node test-auth.js
```

---

## 📝 Testing Steps

### Step 1: Test Registration

1. Open the registration page
2. Use one of the test users above
3. Fill in all fields
4. Click "Register"
5. You should see success and be redirected to dashboard

### Step 2: Test Login

1. Logout (if logged in)
2. Go to login page
3. Use the same credentials you registered with
4. Click "Login"
5. You should be logged in successfully

### Step 3: Test Duplicate Email

1. Try to register with an email that already exists
2. You should see: "User with this email already exists"

### Step 4: Test Invalid Credentials

1. Try to login with wrong password
2. You should see: "Invalid email or password"

---

## 🔍 Troubleshooting

### Registration Fails

**Error: "User with this email already exists"**
- ✅ This is normal if the user was already created
- Solution: Use a different email or login instead

**Error: "Registration failed"**
- Check if the backend server is running
- Check browser console for errors
- Check server logs for detailed error messages

### Login Fails

**Error: "Invalid email or password"**
- Make sure you're using the correct email and password
- Make sure the user was registered successfully
- Check if the backend server is running

### Server Not Responding

**Error: Network error or connection refused**
- Make sure the backend server is running on port 5000
- Check if the API URL is correct in the frontend
- Verify the server is accessible at `http://localhost:5000/api/health`

---

## 🎨 Quick Copy-Paste Credentials

### For Registration:
```
Name: John Doe
Email: john.doe@example.com
Password: password123
Confirm Password: password123
```

### For Login:
```
Email: john.doe@example.com
Password: password123
```

---

## ✅ Success Indicators

When registration is successful, you should:
- ✅ See a success message
- ✅ Be redirected to the dashboard
- ✅ See your name in the navigation
- ✅ Be able to access protected routes

When login is successful, you should:
- ✅ See a success message
- ✅ Be redirected to the dashboard
- ✅ See your name in the navigation
- ✅ Be able to access protected routes

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs for detailed errors
3. Verify the database is set up correctly
4. Make sure both frontend and backend servers are running

---

**Happy Testing! 🎉**

