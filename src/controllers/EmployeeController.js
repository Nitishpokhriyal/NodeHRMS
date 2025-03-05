const  pool  = require("../../config/dbConfig");
const { generateToken } = require("../services/auth");
const bcrypt = require('bcrypt');

async function employeeData(req, resp) {
    const { empname, empcode, empemail, empphone, empbranch, empdoj, empdob, companyid } = req.body;

    try {
        // 🔹 Validate Required Fields
        if (!empname || !empcode || !empemail || !empphone || !empbranch || !empdoj || !empdob || !companyid) {
            return resp.status(400).json({ error: "All fields are required." });
        }

        // 🔹 Validate Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(empemail)) {
            return resp.status(400).json({ error: "Invalid email format." });
        }

        // 🔹 Check if empcode or empemail already exists (Pre-check)
        const checkQuery = `SELECT empcode, empemail FROM mst_employees WHERE empcode = $1 OR empemail = $2`;
        const checkResult = await pool.query(checkQuery, [empcode, empemail]);

        if (checkResult.rowCount > 0) {
            const existing = checkResult.rows[0];
            if (existing.empcode === empcode) {
                return resp.status(400).json({ error: `Employee Code '${empcode}' already exists.` });
            }
            if (existing.empemail === empemail) {
                return resp.status(400).json({ error: `Email '${empemail}' is already registered.` });
            }
        }

        // 🔹 Generate password (empcode + "@123")
        const emppswd = empcode + "Abc@123";  
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(emppswd, saltRounds);
        // 🔹 Insert Employee Data
        const query = `
            INSERT INTO mst_employees 
            ("empautoid", "empname", "empcode", "empemail", "empphone", "empbranch", "empdoj", "empdob", "companyid", "emppswd") 
            VALUES (
                TO_CHAR(CURRENT_DATE, 'YYYY') || '00' || LPAD(nextval('emp_serial')::TEXT, 3, '0'),
                $1, $2, $3, $4, $5, $6, $7, $8, $9
            )
            RETURNING "empautoid";
        `;

        const values = [empname, empcode, empemail, empphone, empbranch, empdoj, empdob, companyid, hashedPassword];

        let result;
    
        try {
            result = await pool.query(query, values);
        } catch (dbError) {
            // 🔹 Handle Unique Constraint Violation (Duplicate empcode or email)
            if (dbError.code === "23505") {
                return resp.status(400).json({ error: "Employee Code or Email already exists." });
            }
            console.error('Database query failed:', dbError);
            return resp.status(500).json({ error: 'Database Error' });
        }

        if (result.rowCount === 0) {
            return resp.status(400).json({ error: 'Failed to insert employee data.' });
        }

        return resp.status(201).json({ error: false, empautoId: result.rows[0].empautoid });

    } catch (error) {
        console.error('Employee data insert error:', error);
        return resp.status(500).json({ error: 'Internal Server Error' });
    }
}






async function empLogin(req, resp) {
    const { empemail, emppswd } = req.body;

    try {
        // Validation functions
        function isValidEmail(email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        }

        function isValidPswd(pswd) {
            const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return regex.test(pswd);
        }

        // Validate email and password format
        if (!isValidEmail(empemail)) {
            return resp.status(400).json({ error: 'Invalid email format.' });
        }

        if (!isValidPswd(emppswd)) {
            return resp.status(400).json({
                error: 'Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.',
            });
        }

        // Fetch user from database
        const query = `SELECT "empcode", "empemail", "emppswd" FROM mst_employees WHERE "empemail" = $1`;
        const values = [empemail];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return resp.status(401).json({ error: 'Invalid credentials.' });
        }

        const { empcode, emppswd: hashedPassword } = result.rows[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(emppswd, hashedPassword);
        if (!passwordMatch) {
            return resp.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate token
        const token = generateToken({ id: empcode });
        resp.header('token',token)
        // Send response
        return resp.status(200).json({error: false, Authorization: token, });

    } catch (error) {
        console.error('Login error:', error);
        return resp.status(500).json({ error: 'Error during login' });
    }
}
























module.exports = {
    employeeData,
    empLogin
}