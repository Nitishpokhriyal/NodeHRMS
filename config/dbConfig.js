// const { Client } = require('pg');

// const client = new Client({
//     host: "db.efujrfiftkzmbljxkhny.supabase.co",
//     port: 5432, // Using non-pooling port
//     user: "postgres",
//     password: "Udo4jpvJYfuVY05X",
//     database: "postgres",
//     ssl: {
//         rejectUnauthorized: false // Required for secure connection
//     }
// });

// const connectDB = async () => {
//     try {
//         await client.connect();
//         console.log('Connected to PostgreSQL database');
//     } catch (err) {
//         console.error('Connection error:', err.message);
//         throw new Error('Database connection failed');
//     }
// };

// const closeDB = async () => {
//     try {
//         await client.end();
//         console.log('Disconnected from PostgreSQL database');
//     } catch (err) {
//         console.error('Error closing database connection:', err.message);
//     }
// };

// module.exports = { client, connectDB, closeDB };
   

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgres://postgres.efujrfiftkzmbljxkhny:Udo4jpvJYfuVY05X@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Function to test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to the database");
    client.release();
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
  }
};

testConnection(); // Test connection when the app starts

module.exports = pool;
