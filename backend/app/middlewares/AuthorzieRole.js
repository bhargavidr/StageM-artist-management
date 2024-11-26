const AuthorizeRole = (permittedRoles) => {
    return (req, res, next) => {
        if(permittedRoles.includes(req.user.role)) {
            next()
        } else {
            // console.log(req.user.role, 'role')
            res.status(401).json({ error: 'You dont have permission to access this route'})
        }
    }
}

module.exports = AuthorizeRole