const express = require('express');
const db = require('../db/users');
const orders = require('../db/orders');
const util = require('./util');

const usersRouter = express.Router();

//Get Logged in User
usersRouter.get('/:id', util.checkAuth, db.getLoggedInUser);

// Register a new user.
usersRouter.post('/', db.newUser)

// Get user orders.
usersRouter.get('/:id/orders', util.checkAuth, orders.getLoggedInUserOrders);

// Update details of logged in user.
usersRouter.put('/:id', util.checkAuth, db.updatedLoggedInUser)

// Delete currently logged in user.
usersRouter.delete('/:id', util.checkAuth, db.deleteLoggedInUser)

module.exports = usersRouter;