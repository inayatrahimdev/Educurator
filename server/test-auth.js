/**
 * Test Authentication Script
 * Creates a test user and tests registration/login
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Random test user data
const testUsers = [
    {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
    },
    {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'securepass456'
    },
    {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        password: 'mypassword789'
    },
    {
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        password: 'testpass123'
    },
    {
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        password: 'password456'
    }
];

async function testRegistration(userData) {
    console.log(`\n📝 Testing Registration for: ${userData.name}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Password: ${userData.password}`);
    
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        console.log('✅ Registration Successful!');
        console.log(`   User ID: ${response.data.data.user.id}`);
        console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
        return { success: true, userData, token: response.data.data.token };
    } catch (error) {
        if (error.response) {
            console.log('❌ Registration Failed:');
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Message: ${error.response.data.message || error.response.data.error}`);
        } else {
            console.log('❌ Registration Failed:', error.message);
        }
        return { success: false, error: error.response?.data || error.message };
    }
}

async function testLogin(userData) {
    console.log(`\n🔐 Testing Login for: ${userData.email}`);
    
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: userData.email,
            password: userData.password
        });
        console.log('✅ Login Successful!');
        console.log(`   User: ${response.data.data.user.name}`);
        console.log(`   Email: ${response.data.data.user.email}`);
        console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
        return { success: true, user: response.data.data.user, token: response.data.data.token };
    } catch (error) {
        if (error.response) {
            console.log('❌ Login Failed:');
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Message: ${error.response.data.message || error.response.data.error}`);
        } else {
            console.log('❌ Login Failed:', error.message);
        }
        return { success: false, error: error.response?.data || error.message };
    }
}

async function runTests() {
    console.log('🚀 Starting Authentication Tests...\n');
    console.log('='.repeat(60));
    
    // Test with first user
    const testUser = testUsers[0];
    
    // Test Registration
    const regResult = await testRegistration(testUser);
    
    if (regResult.success) {
        console.log('\n' + '='.repeat(60));
        // Wait a bit before login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test Login
        await testLogin(testUser);
    } else {
        // If registration failed (maybe user exists), try login
        if (regResult.error?.message?.includes('already exists')) {
            console.log('\n⚠️  User already exists, testing login...');
            console.log('='.repeat(60));
            await testLogin(testUser);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📋 Available Test Users:');
    console.log('='.repeat(60));
    testUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed!\n');
}

// Run tests
runTests().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
});

