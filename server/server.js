const express = require('express');
const db = require('./db');
const parser = require('body-parser');

const app = express();

// Variables
const PORT = 4001;

// Middlewares
app.use(parser.json())

app.get('/', db.getUsers)

app.post('/users', db.new_user)


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});