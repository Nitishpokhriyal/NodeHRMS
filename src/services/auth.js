// jwtUtils.js
const jwt = require("jsonwebtoken");

// Function to generate a JWT token
const options = {
    expiresIn: '1h', // Set token expiration
  };
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, options );
};

module.exports = {
    
    generateToken,
    
};
