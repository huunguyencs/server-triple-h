const Users = require("../Models/user.model")
const jwt = require('jsonwebtoken')

// function isTokenExpired(token) {
//     const payloadBase64 = token.split('.')[1];
//     const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
//     const decoded = JSON.parse(decodedJson)
//     const exp = decoded.exp;
//     const expired = (Date.now() >= exp * 1000)
//     return expired
// }

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization")
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) return res.status(401).json({ success: false, message: "Access Token not found." })
        // const check = await isTokenExpired(token)
        // if(check) return res.status(200).json({ success: false, message: "Access Token Expired" })
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        if (!decoded) return res.status(401).json({ success: false, message: "Invalid Authentication." })

        const user = await Users.findOne({ _id: decoded.id })

        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ success: false, message: "error"})
    }
}

module.exports = auth;