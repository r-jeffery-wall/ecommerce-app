const Pool = require('pg').Pool;
const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;
const bcrypt = require('bcrypt');
const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
})

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        console.log(err);
    }
    return null
}



// USERS
// DB Queries:
const getUsers = async (req, res) => {
    await pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
        if (err) {
            throw err
        }
        res.status(200).json(results.rows)
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

// Deletes a user from the DB.
const deleteUser = async (req, res) => {
    const { username } = await req.body
    await pool.query('DELETE FROM users WHERE users.username = $1', [username], (err, results) => {
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
    getUsers,
    newUser,
    deleteUser,
    findUserByUsername,
    findUserById
}