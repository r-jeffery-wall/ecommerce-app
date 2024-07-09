const express = require('express');
const parser = require('body-parser');
const auth = require('./auth');
const session = require('express-session');
const usersDb = require('./db/users');
const passport = require('passport');
const morgan = require('morgan');

//Routers
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');

const app = express();

// Variables
const PORT = 4001;

// Middlewares
app.use(morgan('tiny'));
app.use(parser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).send(err)
})

// Router set-up
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/users', usersRouter);

// Set-up local strategy
passport.use(auth.setupAuth);
passport.serializeUser((user, done) => {
    return done(null, user.id);
})
passport.deserializeUser((id, done) => {
    usersDb.findUserById(id, (err, user) => {
        if (err) return done(err);
        return done(null, user)
    })
})

app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to this simple generic e-commerce API."})
})

app.post('/login', passport.authenticate('local', {failWithError: true}), (req, res) => {
    res.status(200).send(`${req.user.username} logged in.`)
})

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
    })
    res.status(200).send("User logged out.");
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});