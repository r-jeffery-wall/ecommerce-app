const express = require('express');
const db = require('../db/orders');

const ordersRouter = express.Router();

// Get an order by Id.
ordersRouter.get('/:id', db.getOrderById);

// Delete an order by Id
ordersRouter.delete('/:id', db.deleteOrderById);

module.exports = ordersRouter;