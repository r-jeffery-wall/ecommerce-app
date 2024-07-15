const express = require("express");
const db = require("../db/orders");
const util = require("./util");

const ordersRouter = express.Router();

// Get all orders
ordersRouter.get("/", util.checkAdmin, db.getAllOrders);

// Get an order by Id.
ordersRouter.get("/:id", util.checkAuth, db.getOrderById);

// Delete an order by Id
ordersRouter.delete("/:id", util.checkAuth, db.deleteOrderById);

module.exports = ordersRouter;
