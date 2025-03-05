const  pool  = require("../../config/dbConfig");

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
        const emppswd = empcode + "@123";  

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

        const values = [empname, empcode, empemail, empphone, empbranch, empdoj, empdob, companyid, emppswd];

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
























module.exports = {
    employeeData
}