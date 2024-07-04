const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const bcrypt = require('bcrypt');
const hash = require('./crypt').hashPassword;

const setupAuth = async (username, password, done) => {
    const hashedPassword = await hash(password);
    const user = await db.findUserByUsername(username);

    // User not found.
    if (!user) {
        console.log("user not found.")
        return done(null, false), { message: "user not found" }
    }
    // User found but password does not match.
    if (!bcrypt.compare(password, user.password)) { 
        console.log("Incorrect password.")
        return done(null, false, { message: "Incorrect password."})
    }
    // User found and passwords match.
    return done(null, user, { message: "user successfully authenticated." })

}

module.exports = {
    setupAuth
}