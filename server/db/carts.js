const pool = require('./dbConnect');

// Get information on the current user's cart.
const getLoggedInUserCart = async (req, res) => {
    const user = req.user.id;
    await pool.query('SELECT * FROM carts WHERE user_id = $1', [user], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(results.rows[0])
    })
}

// Add an item to a user's cart, if the cart does not exist it will be created.
const addItemToCart = async (req, res) => {
    const user = req.user.id;
    const { itemId } = req.body;
    const currentCart = await getCurrentCart(user);
    console.log(currentCart);
    if (!currentCart) {
        await pool.query('INSERT INTO carts(user_id, items) VALUES($1, $2) RETURNING *', [user, itemId], (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results.rows[0])
        })
    } else {
        const newCart = currentCart + ", " + itemId
        await pool.query('UPDATE carts SET items = $1 WHERE user_id = $2 RETURNING *', [newCart, user], (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results.rows[0])
        })
    }
}

// Delete a logged in user's cart.
const deleteLoggedInUserCart = async (req, res) => {
    const user = req.user.id;
    await pool.query('DELETE FROM carts WHERE user_id = $1', [user], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(204).send('Record deleted successfully.')
    })
}

// Checkout with the logged in user's cart.
const checkoutCurrentCart = async (req, res, next) => {
    const user = req.user.id;
    const address = req.user.address;
    const items = await getCurrentCart(user);
    const { price } = req.body // I'm assuming this will be calculated client-side.

    const results = await pool.query('INSERT INTO orders(user_id, items, delivery_address, price) VALUES($1, $2, $3, $4) RETURNING * ', [user, items, address, price])

    await pool.query('DELETE FROM carts WHERE user_id = $1', [user], (err) => {
        if (err) {
            res.status(500).send(err)
        }
        res.status(200).send(`Order successfully placed: ${JSON.stringify(results.rows[0])}`)
    })
}

const getCurrentCart = async (user,) => {
    const results = await pool.query('SELECT items FROM carts WHERE user_id = $1', [user])
    if (results.rows[0]) {
        return results.rows[0].items
    } else {
        return null
    }
}
module.exports = {
    getLoggedInUserCart,
    addItemToCart,
    deleteLoggedInUserCart,
    checkoutCurrentCart
}