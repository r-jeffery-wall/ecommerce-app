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
const findUserByUsername = async (username, callbackFn) => {
    try {
        const results = await pool.query('SELECT * FROM users WHERE users.username = $1', [username])
        return callbackFn(null, results.rows[0])
    } catch (err) {
        return callbackFn(err, null)
    }
}

const findUserById = async (id, callbackFn) => {
    try {
        const results = await pool.query('SELECT * FROM users WHERE users.id = $1', [id])
        return callbackFn(null, results.rows[0])
    } catch (err) {
        return callbackFn(err, null)
    }
}

// PRODUCTS
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

// CATEGORIES
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
    getUsers,
    newUser,
    deleteUser,
    findUserByUsername,
    findUserById,
    getAllProducts,
    newProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getAllCategories,
    newCategory
}