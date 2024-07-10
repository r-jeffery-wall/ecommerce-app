// Middleware to check for logged in user.

const checkForUser = async (req, res, next) => {
    if (!req.user) {
        res.status(400).send('No user logged in!')
    } else {
        next()
    }
}

module.exports = {
    checkForUser
}