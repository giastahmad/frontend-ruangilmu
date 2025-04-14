const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/appConfig');
const httpStatus = require('../constants/httpStatus');

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authoriation').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(httpStatus.UNAUTHORIZED).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }
};