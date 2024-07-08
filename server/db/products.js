const Pool = require('pg').Pool;
const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;
const pool = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
})

const getAllProducts = async (req, res) => {
    await pool.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows)
    })
}

const getProductById = async (req, res) => {
    const id = req.params.id
    await pool.query('SELECT * FROM products WHERE id = $1', [id], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows[0])
    })
}

const updateProductById = async (req, res) => { // This route needs updating to better handle params.
    const id = req.params.id
    const { name, price, description, category, quantity, image } = req.body;
    const category_id = await getCategoryId(category) 
    await pool.query(`UPDATE products SET name = $1, price = $2, description = $3, category_id = $4, quantity_available = $5, image = $6 WHERE id = $7 RETURNING *`, [name, price, description, category_id, quantity, image, id], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows[0])
    })
}

const deleteProductById = async (req, res) => {
    const id = req.params.id
    await pool.query('DELETE FROM products WHERE id = $1', [id], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(204).send('Product successfully deleted.')
    })
}


const newProduct = async (req, res) => {
    const { name, price, description, category, quantity, image } = req.body;
    const category_id = await getCategoryId(category)
    await pool.query('INSERT INTO products(name, price, description, category_id, quantity_available, image) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [name, price, description, category_id, quantity, image], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows[0])
    })
}

module.exports = {
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    newProduct
}