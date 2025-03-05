const  pool  = require("../../config/dbConfig");

async function employeeData(req, resp) {
    const { empname, empcode, empemail, empphone, empbranch, empdoj, empdob, companyid } = req.body;

    try {
        const query = `
            INSERT INTO mst_employees 
            ("empautoid", "empname", "empcode", "empemail", "empphone", "empbranch", "empdoj", "empdob", "companyid") 
            VALUES (
                TO_CHAR(CURRENT_DATE, 'YYYY') || '00' || LPAD(nextval('emp_serial')::TEXT, 3, '0'),
                $1, $2, $3, $4, $5, $6, $7, $8
            )
            RETURNING "empautoid";
        `;

        const values = [empname, empcode, empemail, empphone, empbranch, empdoj, empdob, companyid];

        let result;
    
        try {
            result = await pool.query(query, values);
            
        } catch (dbError) {
            console.error('Database query failed:', dbError);
            return resp.status(500).json({ error: 'Database Error' });
        }

        if (result.rowCount === 0) {
            return resp.status(400).json({ error: 'Failed to insert employee data.' });
        }



        return resp.status(201).json({ error: false , empautoId: result.rows[0].empautoid });

    } catch (error) {
        console.error('Employee data insert error:', error);
        return resp.status(500).json({ error: 'Internal Server Error' });
    }
}



















module.exports = {
    employeeData
}