const pool = require('./dbConnect');

const getAllCategories = async (req, res) => {
    await pool.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows)
    })
}


const newCategory = async (req, res) => {
    console.log(req.body);
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

const updateCategory = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows[0])
    })
}

const deleteCategoryById = async (req, res) => {
    const id = req.params.id;
    await pool.query('DELETE FROM categories WHERE id = $1', [id], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(204).send('Entry successfully deleted.')
    })
}

module.exports = {
    getAllCategories,
    newCategory,
    getCategoryId,
    updateCategory,
    deleteCategoryById
}