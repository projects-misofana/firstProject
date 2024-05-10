const jwt = require('jsonwebtoken');
const User = require('../accounts/models/user_model');
const {secret_kay} = require('../configs/vars');

const authValidator = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({error: 'No token provided'});
        }
        const decoded = await jwt.verify(token.split(' ')[1], secret_kay);
        const user = await User.findOne({username: decoded.username});

        if (!user) {
            return res.status(401).json({error: 'User not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Invalid token'});
    }
};

module.exports = authValidator;
