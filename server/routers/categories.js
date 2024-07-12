const express = require('express');
const db = require('../db/categories');

const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get('/', db.getAllCategories);

// Get category by id
categoriesRouter.get('/:id', db.getCategoryById);

// Add a new category
categoriesRouter.post('/', db.newCategory);

// Update a category
categoriesRouter.put('/:id', db.updateCategory);

// Delete a category
categoriesRouter.delete('/:id', db.deleteCategoryById);

module.exports = categoriesRouter;