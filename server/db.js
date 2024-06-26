const Pool = require('pg').Pool;
const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;
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
const new_user = async (req, res) => {
    const { username, password, address } = await req.body;
    await pool.query('INSERT INTO users(username, password, address) VALUES($1, $2, $3) RETURNING *', [username, password, address], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).json(results.rows)
    })
}

const delete_user = async (req, res) => {
    const { username } = await req.body
    await pool.query('DELETE FROM users WHERE users.username = $1', [username], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(204).send()
    })
}

module.exports = {
    getUsers,
    new_user,
    delete_user
}