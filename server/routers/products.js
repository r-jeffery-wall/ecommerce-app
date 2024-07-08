const express = require('express');
const db = require('../db/products');

const app = express();

const productsRouter = express.Router();

// Get all products.
productsRouter.get('/', db.getAllProducts);

// Get product by ID.
productsRouter.get('/:id', db.getProductById);

// Add a new product.
productsRouter.post('/', db.newProduct);

// Update a product by Id.
productsRouter.put('/:id', db.updateProductById);

// Delete a product by Id
productsRouter.delete('/:id', db.deleteProductById);



module.exports = productsRouter;