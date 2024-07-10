const express = require('express');
const db = require('../db/carts');
const util = require('./util');


const cartsRouter = express.Router();

// Get Logged in user cart.
cartsRouter.get('/', util.checkForUser, db.getLoggedInUserCart);

// Add item to user cart
cartsRouter.post('/', util.checkForUser, db.addItemToCart);

// Delete logged in user cart.
cartsRouter.delete('/', util.checkForUser, db.deleteLoggedInUserCart);

module.exports = cartsRouter;