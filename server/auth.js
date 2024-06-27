const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

const setupAuth = async (username, password, done) => {
    const user = await db.findUserByUsername(username);
    // User not found.
    if (!user) {return done(null, false), { message: "user not found" }}
    // User found but password does not match.
    if (user.password !== password) { return done(null, false, { message: "Incorrect password."})}
    // User found and passwords match.
    return done(null, user, { message: "user successfully authenticated." })

}

module.exports = {
    setupAuth
}