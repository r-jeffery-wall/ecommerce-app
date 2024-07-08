const express = require('express');
const db = require('../db/users');

const app = express();

const usersRouter = express.Router();

// Register a new user.
usersRouter.post('/', db.newUser)

// Delete a user.
usersRouter.delete('/', db.deleteUser)

module.exports = usersRouter;