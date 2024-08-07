const bcrypt = require("bcrypt");
const pool = require("./dbConnect");

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.log(err);
  }
  return null;
};

// Get all users
const getAllUsers = async (req, res) => {
  await pool.query("SELECT * FROM USERS", (err, results) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(results.rows);
  });
};

// Get information on a user:
const getLoggedInUser = async (req, res) => {
  const userId = req.params.id;
  await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userId],
    (err, results) => {
      if (err) {
        throw err;
      }
      const user = results.rows[0];
      if (!user) {
        res.status(404).send("No user found.");
      }
      const userObj = {
        // We modify the user object in order to not send the password hash back.
        id: user.id,
        username: user.username,
        address: user.address,
      };
      res.status(200).json(userObj);
    },
  );
};

// Adds a new user to the DB.
const newUser = async (req, res) => {
  const { username, address } = await req.body;
  const password = await hashPassword(req.body.password);
  await pool.query(
    "INSERT INTO users(username, password, address) VALUES($1, $2, $3) RETURNING *",
    [username, password, address],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(results.rows[0]);
    },
  );
};

// Make a user admin.
const makeUserAdmin = async (req, res) => {
  const userId = req.params.id;
  await pool.query(
    "UPDATE users SET admin = true WHERE id = $1 RETURNING *",
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send();
      }
      if (!results.rows[0]) {
        res.status(404).send("No user found");
      }
      res.status(200).send(results.rows[0]);
    },
  );
};

// Revoke a user's admin privileges
const revokeUserAdmin = async (req, res) => {
  const userId = req.params.id;
  await pool.query(
    "UPDATE users SET admin = false WHERE id = $1 RETURNING *",
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send();
      }
      if (!results.rows[0]) {
        res.status(404).send("No user found");
      }
      res.status(200).send(results.rows[0]);
    },
  );
};

// Updates a logged in user's details
const updatedLoggedInUser = async (req, res) => {
  const userId = req.params.id;
  const { username, address } = req.body;
  const password = await hashPassword(req.body.password);
  await pool.query(
    "UPDATE users SET username = $1, password = $2, address = $3 WHERE id = $4 RETURNING *",
    [username, password, address, userId],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      if (!results.rows[0]) {
        res.status(404).send("No user found.");
      }
      res.status(200).send(results.rows[0]);
    },
  );
};

// Deletes a user from the DB.
const deleteLoggedInUser = async (req, res) => {
  const userId = req.params.id;
  await pool.query(
    "DELETE FROM users WHERE users.id = $1",
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(204).send();
    },
  );
};

// Finds a user from username.
const findUserByUsername = async (username, callbackFn) => {
  try {
    const results = await pool.query(
      "SELECT * FROM users WHERE users.username = $1",
      [username],
    );
    return callbackFn(null, results.rows[0]);
  } catch (err) {
    return callbackFn(err, null);
  }
};

// Finds a user by ID.
const findUserById = async (id, callbackFn) => {
  try {
    const results = await pool.query(
      "SELECT * FROM users WHERE users.id = $1",
      [id],
    );
    return callbackFn(null, results.rows[0]);
  } catch (err) {
    return callbackFn(err, null);
  }
};

module.exports = {
  getAllUsers,
  getLoggedInUser,
  newUser,
  makeUserAdmin,
  revokeUserAdmin,
  updatedLoggedInUser,
  deleteLoggedInUser,
  findUserByUsername,
  findUserById,
};
