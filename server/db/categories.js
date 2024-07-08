const Pool = require('pg').Pool;
const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;
const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
})

const getAllCategories = async (req, res) => {
    await pool.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows)
    })
}


const newCategory = async (req, res) => {
    const { name } = req.body;
    await pool.query('INSERT INTO categories(name) VALUES($1) RETURNING *', [name], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows[0])
    })
}

const getCategoryId = async (name) => {
    try {
        const results = await pool.query('SELECT id FROM categories WHERE categories.name = $1', [name])
        return results.rows[0].id
    } catch (err) {
        return err
    }
}

module.exports = {
    getAllCategories,
    newCategory,
    getCategoryId
}