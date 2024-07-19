const express = require("express");
const db = require("../db/products");
const util = require("./util");

const productsRouter = express.Router();

// Get all products.
productsRouter.get("/", db.getAllProducts);

// Get product by ID.
productsRouter.get("/:id", db.getProductById);

// Add a new product.
productsRouter.post("/", util.checkAdmin, db.newProduct);

// Update a product by Id.
productsRouter.put("/:id", util.checkAdmin, db.updateProductById);

// Delete a product by Id
productsRouter.delete("/:id", util.checkAdmin, db.deleteProductById);

module.exports = productsRouter;
