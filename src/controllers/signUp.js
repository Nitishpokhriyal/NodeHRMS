// const pool = require("../../config/dbConfig");
// const bcrypt = require("bcrypt");

// // User Signup
// const signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if the user already exists
//     const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);
//     if (checkUser.rows.length > 0) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert the new user into the database
//     const newUser = await pool.query(
//       "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
//       [name, email, hashedPassword]
//     );

//     // Return success response
//     res.status(201).json({
//       message: "User created successfully",
//       user: newUser.rows[0],
//     });
//   } catch (err) {
//     console.error("❌ Signup Error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { signup };
