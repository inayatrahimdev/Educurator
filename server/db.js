/**
 * Database Connection Module
 * Handles MSSQL Server connection using mssql package
 */

const sql = require('mssql');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['DB_USER', 'DB_PASS', 'DB_SERVER', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => {
        console.error(`   - ${varName}`);
    });
    console.error('\n💡 Please create a .env file in the server directory with the required variables.');
    console.error('   You can use .env.example as a template.\n');
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Database configuration from environment variables
// Detect if we're using Azure SQL Database
const isAzure = process.env.AZURE_SQL || process.env.DB_SERVER?.includes('.database.windows.net');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: isAzure ? true : (process.env.DB_ENCRYPT === 'true'), // Azure requires encryption
        trustServerCertificate: !isAzure, // Don't trust for Azure, use proper certificates
        enableArithAbort: true,
        instanceName: process.env.DB_INSTANCE || '',
        // Azure SQL Database specific options
        ...(isAzure && {
            requestTimeout: 30000,
            connectionTimeout: 30000
        })
    },
    pool: {
        max: isAzure ? 20 : 10, // Azure allows more connections
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Log database configuration (without password)
console.log('📊 Database Configuration:');
console.log(`   Server: ${config.server}`);
console.log(`   Database: ${config.database}`);
console.log(`   User: ${config.user}`);
console.log(`   Password: ${config.password ? '***' : 'NOT SET'}\n`);

let poolPromise;

/**
 * Initialize database connection pool
 * Returns a promise that resolves to the connection pool
 */
const getPool = async () => {
    try {
        if (poolPromise) {
            return poolPromise;
        }

        poolPromise = new Promise((resolve, reject) => {
            const pool = new sql.ConnectionPool(config);

            pool.on('close', () => {
                console.log('Database connection pool closed');
                poolPromise = null;
            });

            pool.connect()
                .then(pool => {
                    console.log('Connected to MSSQL Server');
                    resolve(pool);
                })
                .catch(err => {
                    console.error('Database connection error:', err);
                    poolPromise = null;
                    reject(err);
                });
        });

        return poolPromise;
    } catch (error) {
        console.error('Error creating connection pool:', error);
        throw error;
    }
};

/**
 * Execute a SQL query
 * @param {string} query - SQL query string
 * @param {object} params - Query parameters (optional)
 * @returns {Promise} - Query result
 */
const query = async (queryText, params = {}) => {
    try {
        const pool = await getPool();
        const request = pool.request();

        // Add parameters to request
        // mssql package automatically infers types, but we can be explicit for better reliability
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value === null || value === undefined) {
                // Handle null/undefined values
                request.input(key, sql.NVarChar, null);
            } else {
                // Let mssql infer the type automatically (it's usually reliable)
                request.input(key, value);
            }
        });

        const result = await request.query(queryText);
        return result;
    } catch (error) {
        console.error('Query execution error:', error);
        console.error('Query:', queryText);
        console.error('Params:', params);
        throw error;
    }
};

/**
 * Execute a stored procedure
 * @param {string} procedureName - Name of the stored procedure
 * @param {object} params - Procedure parameters (optional)
 * @returns {Promise} - Procedure result
 */
const execute = async (procedureName, params = {}) => {
    try {
        const pool = await getPool();
        const request = pool.request();

        // Add parameters to request
        Object.keys(params).forEach(key => {
            request.input(key, params[key]);
        });

        const result = await request.execute(procedureName);
        return result;
    } catch (error) {
        console.error('Stored procedure execution error:', error);
        throw error;
    }
};

/**
 * Close database connection pool
 */
const close = async () => {
    try {
        if (poolPromise) {
            const pool = await poolPromise;
            await pool.close();
            poolPromise = null;
            console.log('Database connection closed');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
        throw error;
    }
};

module.exports = {
    getPool,
    query,
    execute,
    close,
    sql
};

