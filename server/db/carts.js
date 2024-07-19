const pool = require("./dbConnect");

// Get all carts
const getAllCarts = async (req, res) => {
  await pool.query("SELECT * FROM carts", (err, results) => {
    if (err) {
      res.status(500).send();
    }
    res.status(200).send(results.rows);
  });
};

// Get information on the current user's cart.
const getLoggedInUserCart = async (req, res) => {
  const user = req.params.userId;
  await pool.query(
    "SELECT * FROM carts WHERE user_id = $1",
    [user],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      if (!results.rows[0]) {
        res.status(404).send("User or cart does not exist.");
      }
      res.status(200).send(results.rows[0]);
    },
  );
};

// Add an item to a user's cart, if the cart does not exist it will be created.
const addItemToCart = async (req, res) => {
  const user = req.params.userId;
  const { itemId } = req.body;
  const currentCart = await getCurrentCart(user);
  console.log(currentCart);
  if (!currentCart) {
    await pool.query(
      "INSERT INTO carts(user_id, items) VALUES($1, $2) RETURNING *",
      [user, itemId],
      (err, results) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(results.rows[0]);
      },
    );
  } else {
    const newCart = currentCart + ", " + itemId;
    await pool.query(
      "UPDATE carts SET items = $1 WHERE user_id = $2 RETURNING *",
      [newCart, user],
      (err, results) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(results.rows[0]);
      },
    );
  }
};

// Delete a logged in user's cart.
const deleteLoggedInUserCart = async (req, res) => {
  const user = req.user.id;
  await pool.query(
    "DELETE FROM carts WHERE user_id = $1",
    [user],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(204).send("Record deleted successfully.");
    },
  );
};

// Checkout with the logged in user's cart.
const findCartForCheckout = async (req, res, next) => {
  const user = req.user.id;
  const address = req.user.address;
  const items = await getCurrentCart(user);
  const { price } = req.body;

  if (!items) {
    res.status(400).send("User has no items in their cart!");
  }

  const order = {
    user_id: user,
    items: items,
    delivery_address: address,
    price: price,
  };

  req.body = order;
  next();
};

const getCurrentCart = async (user) => {
  const results = await pool.query(
    "SELECT items FROM carts WHERE user_id = $1",
    [user],
  );
  if (results.rows[0]) {
    return results.rows[0].items;
  } else {
    return null;
  }
};

module.exports = {
  getAllCarts,
  getLoggedInUserCart,
  addItemToCart,
  deleteLoggedInUserCart,
  findCartForCheckout,
};
