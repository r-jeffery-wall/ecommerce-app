const bcrypt = require('bcrypt');
const pool = require('./dbConnect');

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        console.log(err);
    }
    return null
}

// Check authentication for user-specific endpoints.
const checkAuthentication = async (req, res, next) => {
    const user = req.user;
    const requestUser = req.params.username;
    if (user !== requestUser) {
        1
        res.status(403).send('You are not authorised to access this resource.')
    } else {
        next()
    }
}


// USERS
// Get information on the logged in user:
const getLoggedInUser = async (req, res) => {
    const userId = req.user.id
    await pool.query('SELECT * FROM users WHERE id = $1', [userId], (err, results) => {
        if (err) {
            throw err
        }
        const user = results.rows[0]
        const userObj = { // We modify the user object in order to not send the password hash back.
            username: user.username,
            address: user.address
        }
        res.status(200).json(userObj)
    })
}


// Adds a new user to the DB.
const newUser = async (req, res) => {
    const { username, address } = await req.body;
    const password = await hashPassword(req.body.password);
    await pool.query('INSERT INTO users(username, password, address) VALUES($1, $2, $3) RETURNING *', [username, password, address], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).json(results.rows[0])
    })
}

// Updates a logged in user's details
const updatedLoggedInUser = async (req, res) => {
    const userId = req.user.id;
    const { username, address } = req.body
    const password = await hashPassword(req.body.password);
    await pool.query('UPDATE users SET username = $1, password = $2, address = $3 WHERE id = $4 RETURNING *', [username, password, address, userId], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows[0])
    })
}

// Deletes a user from the DB.
const deleteLoggedInUser = async (req, res) => {
    const userId = req.user.id
    await pool.query('DELETE FROM users WHERE users.id = $1', [userId], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(204).send()
    })
}

// Finds a user from username.
const findUserByUsername = async (username, callbackFn) => {
    try {
        const results = await pool.query('SELECT * FROM users WHERE users.username = $1', [username])
        return callbackFn(null, results.rows[0])
    } catch (err) {
        return callbackFn(err, null)
    }
}

// Finds a user by ID.
const findUserById = async (id, callbackFn) => {
    try {
        const results = await pool.query('SELECT * FROM users WHERE users.id = $1', [id])
        return callbackFn(null, results.rows[0])
    } catch (err) {
        return callbackFn(err, null)
    }
}

module.exports = {
    checkAuthentication,
    getLoggedInUser,
    newUser,
    updatedLoggedInUser,
    deleteLoggedInUser,
    findUserByUsername,
    findUserById
}