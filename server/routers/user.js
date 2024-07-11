const express = require('express');
const db = require('../db/users');
const orders = require('../db/orders');
const util = require('./util');

const usersRouter = express.Router();

//Get Logged in User
usersRouter.get('/', util.checkForUser, db.getLoggedInUser);

// Register a new user.
usersRouter.post('/', db.newUser)

// Get user orders.
usersRouter.get('/orders', util.checkForUser, orders.getLoggedInUserOrders);

// Update details of logged in user.
usersRouter.put('/', util.checkForUser, db.updatedLoggedInUser)

// Delete currently logged in user.
usersRouter.delete('/', util.checkForUser, db.deleteLoggedInUser)

module.exports = usersRouter;