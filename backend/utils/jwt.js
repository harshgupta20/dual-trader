const jwt = require('jsonwebtoken');
require('dotenv').config();


function signToken(payload, expiresIn = '12h') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

module.exports = { signToken, verifyToken };