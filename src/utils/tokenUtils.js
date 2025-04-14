const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/appConfig');

const generateToken = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
};

module.exports = {
    generateToken
};

