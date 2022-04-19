const Users = require("../Models/user.model")
const jwt = require('jsonwebtoken')


const fakeAuth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            req.user = { _id: 0 };
            next();
        } else {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            if (!decoded) {
                req.user = { _id: 0 };
                next();
            }
            else {
                const user = await Users.findOne({ _id: decoded.id })
                req.user = user
                next()
            }
        }

    } catch (err) {
        req.user = { _id: 0 };
        next();
    }
}

module.exports = fakeAuth;