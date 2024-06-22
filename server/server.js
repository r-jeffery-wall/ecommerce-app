const express = require('express');
const db = require('./db');

const app = express();

// Variables
const PORT = 4001;

app.get('/', db.getUsers)


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});