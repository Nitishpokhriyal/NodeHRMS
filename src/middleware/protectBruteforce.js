const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 5 login attempts per window
  message: "Too many login attempts. Try again later."
});

module.exports = {
  loginLimiter
}