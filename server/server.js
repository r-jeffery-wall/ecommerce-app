const express = require('express');
const db = require('./db');
const parser = require('body-parser');
const auth = require('./auth');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// Variables
const PORT = 4001;

// Middlewares
app.use(morgan('tiny'));
app.use(parser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Set-up local strategy
passport.use(auth.setupAuth);
passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done (null, user)
})

app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to this simple generic e-commerce API."})
})

app.post('/users', db.newUser)

app.post('/login', passport.authenticate('local', {failureMessage: true}), (req, res) => {
    res.send(req.session.message)
})

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
    })
    res.status(200).send("User logged out.");
})

app.delete('/users', db.deleteUser)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});