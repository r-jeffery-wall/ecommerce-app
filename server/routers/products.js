const express = require('express');
const db = require('../db');

const app = express();

const productsRouter = express.Router();

// Get all products.
productsRouter.get('/', db.getAllProducts);

// Add a new product.
productsRouter.post('/', db.newProduct);




module.exports = productsRouter;