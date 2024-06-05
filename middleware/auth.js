const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming JWT_SECRET is set in environment variables
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ msg: 'Access denied. User not found.' });
        }
        
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired' });
        } else {
            return res.status(500).json({ msg: 'Server error' });
        }
    }
};

const isAdminOrSuperAdmin = (req, res, next) => {
    console.log("this is user: ", req.user)
    if (req.user.role === 'admin' || req.user.role === 'superAdmin') {
        return next();
    }
    res.status(403).send('Access denied.');
};

const isSuperAdmin = (req, res, next) => {
    if (req.user.role === 'superAdmin') {
        return next();
    }
    res.status(403).send('Access denied.');
};

const isConfirmed = (req, res, next) => {
    if (req.user.isConfirmed) {
        return next();
    }
    res.status(403).send('Your registration is not confirmed yet, Will send you Confirmation through email.');
};

module.exports = { authenticateJWT, isAdminOrSuperAdmin, isSuperAdmin, isConfirmed };
