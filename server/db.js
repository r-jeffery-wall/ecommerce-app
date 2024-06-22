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
const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (err, results) => {
        if (err) {
            throw err
        }
        res.status(200).json(results.rows)
    })
}

module.exports = {
    getUsers
}