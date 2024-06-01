const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).send('Access denied. User not found.');
        }
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

const isAdminOrSuperAdmin = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
        return next();
    }
    res.status(403).send('Access denied.');
};

const isSuperAdmin = (req, res, next) => {
    if (req.user.role === 'superadmin') {
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
