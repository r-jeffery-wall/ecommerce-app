const express = require("express");
const db = require("../db/products");
const { body } = require("express-validator");
const validators = require("./validators");
const util = require("./util");

const productsRouter = express.Router();

// Get all products.
productsRouter.get("/", db.getAllProducts);

// Get product by ID.
productsRouter.get("/:id", db.getProductById);

// Add a new product.
productsRouter.post(
  "/",
  util.checkAdmin,
  body("name").notEmpty().isString(),
  body("price").notEmpty().isInt(),
  body("description").notEmpty().isString(),
  body("category").notEmpty().isString(),
  body("quantity").notEmpty().isInt(),
  body("image").isString(),
  validators.catchErrors,
  db.newProduct,
);

// Update a product by Id.
productsRouter.put(
  "/:id",
  util.checkAdmin,
  body("name").notEmpty().isString(),
  body("price").notEmpty().isInt(),
  body("description").notEmpty().isString(),
  body("category").notEmpty().isString(),
  body("quantity").notEmpty().isInt(),
  body("image").isString(),
  validators.catchErrors,
  db.updateProductById,
);

// Delete a product by Id
productsRouter.delete("/:id", util.checkAdmin, db.deleteProductById);

module.exports = productsRouter;
