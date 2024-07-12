const express = require('express');
const db = require('../db/carts');
const util = require('./util');


const cartsRouter = express.Router();

// Get Logged in user cart.
cartsRouter.get('/', util.checkAuth, db.getLoggedInUserCart);

// Add item to user cart
cartsRouter.post('/', util.checkAuth, db.addItemToCart);

// Delete logged in user cart.
cartsRouter.delete('/', util.checkAuth, db.deleteLoggedInUserCart);

// Checkout current user's cart
cartsRouter.post('/checkout', util.checkAuth, db.checkoutCurrentCart);

module.exports = cartsRouter;