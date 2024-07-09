const express = require('express');
const db = require('../db/users');

const app = express();

const usersRouter = express.Router();

//Get Logged in User
usersRouter.get('/', db.getLoggedInUser);

// Register a new user.
usersRouter.post('/', db.newUser)

// Update details of logged in user.
usersRouter.put('/', db.updatedLoggedInUser)

// Delete currently logged in user.
usersRouter.delete('/', db.deleteLoggedInUser)

module.exports = usersRouter;