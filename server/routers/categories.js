const express = require('express');
const db = require('../db/categories');

const categoriesRouter = express.Router();

// Get all categories
categoriesRouter.get('/', db.getAllCategories);

// Add a new category
categoriesRouter.post('/', db.newCategory);

module.exports = categoriesRouter;