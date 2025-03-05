const express = require('express');
const router = express.Router();
const {login,signup} = require('../controllers/userController')
const {employeeData,empLogin} = require('../controllers/EmployeeController')
const { loginLimiter } = require("../middleware/protectBruteforce");
const { validateToken } = require('../middleware/verifyToken');


//Login Routes

router.get('/login', login);
router.post('/signup',signup)
router.post('/employeeData', employeeData);
router.get('/empLogin', empLogin);



module.exports = router;