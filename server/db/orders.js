const pool = require('./dbConnect');

// Get logged in user's orders.
const getLoggedInUserOrders = async (req, res) => {
    const user = req.params.id;
    await pool.query('SELECT * FROM orders WHERE user_id = $1', [user], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows)
    })
}

// Get details of an order by ID.
const getOrderById = async (req, res) => {
    const user = req.user.id;
    const order = req.params.id;
    const results = await pool.query('SELECT * FROM orders WHERE id = $1', [order])
    if (!results) {
        res.status(404).send('No order with this ID found!')
    }
    if (user !== results.rows[0].user_id) {
        res.status(403).send('You are not authorised to view this resource.')
    }
    res.status(200).send(results.rows[0])
}

// Delete an order by Id.
const deleteOrderById = async (req, res) => {
    const user = req.user.id;
    const order = req.params.id;
    const results = await pool.query('SELECT * FROM orders WHERE id = $1', [order])
    if (!results) {
        res.status(404).send('No order with this ID found!')
    }
    if (user !== results.rows[0].user_id) {
        res.status(403).send('You are not authorised to view this resource.')
    }
    await pool.query('DELETE FROM orders WHERE id = $1', [order], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(204).send('Record successfully deleted.')
    })
}
module.exports = {
    getLoggedInUserOrders,
    getOrderById,
    deleteOrderById
}