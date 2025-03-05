const  pool  = require("../../config/dbConfig");
const { generateToken } = require("../services/auth");
const bcrypt = require('bcrypt');





async function login(req, resp) {
    const { companyemail, companypswd } = req.body;

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
        if (!isValidEmail(companyemail)) {
            return resp.status(400).json({ error: 'Invalid email format.' });
        }

        if (!isValidPswd(companypswd)) {
            return resp.status(400).json({
                error: 'Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.',
            });
        }

        // Fetch user from database
        const query = `SELECT "companyid", "companyemail", "companypswd" FROM mst_companies WHERE "companyemail" = $1`;
        const values = [companyemail];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return resp.status(401).json({ error: 'Invalid credentials.' });
        }

        const { companyid, companypswd: hashedPassword } = result.rows[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(companypswd, hashedPassword);
        if (!passwordMatch) {
            return resp.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate token
        // const token = generateToken({ id: companyid });
        // resp.header('token',token)
        // Send response
        return resp.status(200).json({error: false});
    } catch (error) {
        console.error('Login error:', error);
        return resp.status(500).json({ error: 'Error during login',email: req.body.companyemail,pswd: req.body.companypswd });
    }
}





async function signup(req, res) {
    try {
        const { companyname, companyemail, companyphone, companyaddress, companycity, companygst, companypswd, companystate } = req.body;

        function isValidemail(email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        }

        function isValidpswd(password) {
            const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return regex.test(password);
        }

        if (!isValidemail(companyemail)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        if (!isValidpswd(companypswd)) {
            return res.status(400).json({
                error: 'Password must contain a minimum length of 8 characters, one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
            });
        }

        if (!companyname || !companyemail || !companyphone || !companyaddress || !companycity || !companypswd || !companystate) {
            return res.status(400).json({ error: true, msg: "All fields are required." });
        }

        // Check if email or phone already exists
        const existingcompany = await pool.query(
            `SELECT "companyid" FROM mst_companies WHERE "companyemail" = $1 `,
            [companyemail]
        );

        if (existingcompany.rows.length > 0) {
            return res.status(409).json({ error: true, msg: "Email already exists." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(companypswd, saltRounds);

        // Single query to insert both company and branch with the same companyId
        const query = `
           WITH company_insert AS (
    INSERT INTO mst_companies (
        "companyid", "companyname", "companyemail", "companyphone", 
        "companyaddress", "companycity", "companygst", "companypswd", "companystate", "signupdate"
    ) 
    VALUES (
        CONCAT(EXTRACT(YEAR FROM CURRENT_DATE), '0', LPAD(nextval('company_id_seq')::TEXT, 3, '0')),
        $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE
    ) 
    RETURNING "companyid"
)
INSERT INTO mst_branches (
    "autoid", "companyid", "branchname", "branchstate", "branchcity", "branchaddress"
) 
VALUES (
    CONCAT((SELECT "companyid" FROM company_insert), '-', $5), -- autoId = companyid + '-' + companycity
    (SELECT "companyid" FROM company_insert), --  Use companyid from CTE
    $1,   -- branchname = companyname
    $8,   -- branchstate = companystate
    $5,   -- branchcity = companycity
    $4    -- branchaddress = companyaddress
)
RETURNING "autoid"


        `;

        const values = [companyname, companyemail, companyphone, companyaddress, companycity, companygst, hashedPassword, companystate];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return res.status(201).json({
                success: true,
                message: "Company and branch registered successfully.",
                companyId: result.rows[0].companyid,
                autoId: result.rows[0].autoid
            });
        } else {
            return res.status(500).json({ error: true, msg: "Company or branch registration failed." });
        }
    } catch (error) {
        console.error("Signup Error:", error.message);

        if (error.code === "23505") {
            return res.status(409).json({ error: true, msg: "Email already exists." });
        }

        return res.status(500).json({ error: true, msg: "Error during Signup", details: error.message });
    }
}




module.exports ={
login,
signup
}