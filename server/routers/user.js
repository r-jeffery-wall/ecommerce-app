const express = require('express');
const db = require('../db/users');

const usersRouter = express.Router();

const checkForUser = async (req, res, next) => {
    if (!req.user) {
        res.status(400).send('No user logged in!')
    } else {
        next()
    }
}

//Get Logged in User
usersRouter.get('/', checkForUser, db.getLoggedInUser);

// Register a new user.
usersRouter.post('/', db.newUser)

// Update details of logged in user.
usersRouter.put('/', checkForUser, db.updatedLoggedInUser)

// Delete currently logged in user.
usersRouter.delete('/', checkForUser, db.deleteLoggedInUser)

module.exports = usersRouter;