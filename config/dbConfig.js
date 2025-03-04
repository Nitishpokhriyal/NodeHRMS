const { Client } = require('pg');
require('dotenv').config();



const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});



const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Connection error:', err.message);
        throw new Error('Database connection failed');
    }
};

const closeDB = async () => {
    try {
        await client.end();
        console.log('Disconnected from PostgreSQL database');
    } catch (err) {
        console.error('Error closing database connection:', err.message);
    }
};

module.exports = { client, connectDB, closeDB };
