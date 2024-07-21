const express = require("express");
const db = require("../db/users");
const orders = require("../db/orders");
const { body } = require("express-validator");
const validators = require("./validators");
const util = require("./util");

const usersRouter = express.Router();

// Get all users.
usersRouter.get("/", util.checkAdmin, db.getAllUsers);

//Get Logged in User
usersRouter.get("/:id", util.checkAuth, db.getLoggedInUser);

// Register a new user.
usersRouter.post(
  "/",
  body("username").notEmpty().isString(),
  body("password").notEmpty().isStrongPassword(),
  body("address").notEmpty().isString(),
  validators.catchErrors,
  db.newUser,
);

// Get user orders.
usersRouter.get("/:id/orders", util.checkAuth, orders.getLoggedInUserOrders);

// Give a user admin privileges
usersRouter.post("/:id/makeAdmin", util.checkAdmin, db.makeUserAdmin);

// Revoke admin privileges
usersRouter.post("/:id/revokeAdmin", util.checkAdmin, db.revokeUserAdmin);

// Update details of logged in user.
usersRouter.put(
  "/:id",
  util.checkAuth,
  body("username").notEmpty().isString(),
  body("password").notEmpty().isStrongPassword(),
  body("address").notEmpty().isString(),
  validators.catchErrors,
  db.updatedLoggedInUser,
);

// Delete currently logged in user.
usersRouter.delete("/:id", util.checkAuth, db.deleteLoggedInUser);

module.exports = usersRouter;
