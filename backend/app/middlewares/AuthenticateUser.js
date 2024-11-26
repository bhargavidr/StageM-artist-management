// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AuthenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ _id: decoded.id});
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = {
            id: user._id,
            role: user.role,
            email: user.email,
            isPremium: user.isPremium
        };
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = AuthenticateUser