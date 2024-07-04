const Pool = require('pg').Pool;
const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;
const hash = require('./crypt').hashPassword;
const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
})

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
    const password = await hash(req.body.password);
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
const findUserByUsername = async (username) => {
    const results = await pool.query('SELECT * FROM users WHERE users.username = $1', [username])
    return results.rows[0]
}

const findUserById = async (id) => {
    await pool.query('SELECT FROM users WHERE users.id = ?', [id], (err, results) => {
        if (err) {
            console.log(err)
        }
        return results.rows[0]
    })
}

module.exports = {
    getUsers,
    newUser,
    deleteUser,
    findUserByUsername,
    findUserById
}