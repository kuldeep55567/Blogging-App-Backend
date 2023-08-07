const jwt = require('jsonwebtoken')
const User = require("../Model/UserModel")
require("dotenv").config()
const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. No token provided.' });
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findOne({ where: { id: decodedToken.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Access denied. User is blocked.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
}

module.exports = { authMiddleWare }
