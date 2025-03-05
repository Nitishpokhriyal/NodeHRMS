
// const { connectDB, closeDB } = require('./config/dbConfig');
// const userRoutes = require('./src/routes/userRoutes');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();

// // Connect to database
// connectDB().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

// // Middleware
// app.use(cors());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// // Routes
// app.use('/api', userRoutes);

// // Start the server
// const port = 3003;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await closeDB();
//   process.exit(0);
// });



// app.js
require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Database Connection
const pool = new Pool({
  connectionString:  "postgres://postgres.efujrfiftkzmbljxkhny:Udo4jpvJYfuVY05X@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Function to create the users table
const createTable = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    console.log("✅ Users table is ready.");
    client.release();
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
};

// Function to test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to the database");
    client.release();
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
  }
};

// Signup API
app.post("/signup", async (req, res) => {

  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    // Return success response
    res.status(201).json({
      message: "User created successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, async () => {
  await testConnection(); // Test the database connection
  await createTable(); // Create the users table
  console.log(`🚀 Server running on port ${PORT}`);
});