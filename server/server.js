const express = require('express');
const db = require('./db');
const parser = require('body-parser');

const app = express();

// Variables
const PORT = 4001;

// Middlewares
app.use(parser.json())

app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to this simple generic e-commerce API."})
})

app.post('/users', db.new_user)

app.delete('/users', db.delete_user)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});