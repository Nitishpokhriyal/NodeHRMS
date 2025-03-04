const express = require('express');
const router = express.Router();
const {login,signup} = require('../controllers/userController')
const {employeeData} = require('../controllers/EmployeeController')
const { loginLimiter } = require("../middleware/protectBruteforce");
const { validateToken } = require('../middleware/verifyToken');


//Login Routes

router.get('/login',loginLimiter, login);
router.post('/signup',signup)
router.post('/employeeData', employeeData);




module.exports = router;