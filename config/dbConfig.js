const { Client } = require('pg');

const client = new Client({
    host: "db.efujrfiftkzmbljxkhny.supabase.co",
    port: 5432, // Using non-pooling port
    user: "postgres",
    password: "Udo4jpvJYfuVY05X",
    database: "postgres",
    ssl: {
        rejectUnauthorized: false // Required for secure connection
    }
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
   