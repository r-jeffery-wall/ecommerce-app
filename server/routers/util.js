// Middleware to check for logged in user.

const checkAuth = async (req, res, next) => {
    console.log(req.user.id, req.params.id)
    if (!req.user) {
        res.status(400).send('You must be logged in to view this resource.')
    } else if (req.user.id != req.params.id) {
        res.status(403).send('You are not authorised to access this resource.')
    } else {
        next()
    }
}

module.exports = {
    checkAuth
}