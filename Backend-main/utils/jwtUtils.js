const jwt = require('jsonwebtoken');

// FIX: Enforce environment variable presence
if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined in .env file");
}

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '24h'
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    JWT_SECRET
};