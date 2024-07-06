const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const bcrypt = require('bcrypt');
const hash = require('./crypt').hashPassword;

const setupAuth =  new LocalStrategy(
    (username, password, done) => {
    db.findUserByUsername(username, (err, user) => {
        // Error in retrieving user from DB.
        if (err) return done(err);
        // User not found.
        if (!user) return done(null, false, { message: "username not found." });
        //User found, but password is incorrect.
        if (!bcrypt.compare(password, user.password)) return done(null, false, { message: "password incorrect."})
        // User found and password valid.
        return done(null, user);
    });
})

module.exports = {
    setupAuth
}