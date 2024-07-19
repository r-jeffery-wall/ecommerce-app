const express = require("express");
const db = require("../db/categories");
const util = require("./util");

const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get("/", db.getAllCategories);

// Get category by id
categoriesRouter.get("/:id", db.getCategoryById);

// Add a new category
categoriesRouter.post("/", util.checkAdmin, db.newCategory);

// Update a category
categoriesRouter.put("/:id", util.checkAdmin, db.updateCategory);

// Delete a category
categoriesRouter.delete("/:id", util.checkAuth, db.deleteCategoryById);

module.exports = categoriesRouter;
