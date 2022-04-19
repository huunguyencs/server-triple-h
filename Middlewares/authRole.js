
const authRole = (roles) => {
    return (req, res, next) => {
        if (!req.user.role) {
            res.status(401).json({ success: false, message: 'Invalid Authentication.' })
        }
        else {
            if (!roles.includes(req.user.role)) {
                res.status(401).json({ success: false, message: 'Invalid Authentication.' })
            }
            else {
                next();
            }
        }

    }
}


module.exports = authRole;