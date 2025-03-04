const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {

    let token = req.headers.authorization;
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    if (!token) {
        return res.status(401).json({ error: "Token not found" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Invalid or expired token" });
        }
        req.USER_USER_ID = decoded;
        next();
    });
    
}

module.exports = {
    validateToken
};
