const express = require("express");
const db = require("../db/carts");
const orders = require("../db/orders");
const util = require("./util");

const cartsRouter = express.Router();

// Get all carts
cartsRouter.get("/", util.checkAdmin, db.getAllCarts);

// Checkout current user's cart
cartsRouter.post(
  "/checkout",
  util.checkAuth,
  db.findCartForCheckout,
  orders.addOrder,
);

// Get Logged in user cart.
cartsRouter.get("/:userId", util.checkAuth, db.getLoggedInUserCart);

// Add item to user cart
cartsRouter.post("/:userId", util.checkAuth, db.addItemToCart);

// Delete logged in user cart.
cartsRouter.delete("/:userId", util.checkAuth, db.deleteLoggedInUserCart);

module.exports = cartsRouter;
