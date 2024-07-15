// Middleware to check for logged in user.

const checkAuth = async (req, res, next) => {
  if (!req.user) {
    res.status(403).send("You must be logged in to view this resource.");
  } else if (req.user.admin) {
    // Admins can interact with any user-restricted endpoint.
    next();
  } else if (!req.user) {
    res.status(400).send("You must be logged in to view this resource.");
  } else if (req.user.id != req.params.id) {
    res.status(403).send("You are not authorised to access this resource.");
  } else {
    next();
  }
};

// Middleware to check admin rights.
const checkAdmin = async (req, res, next) => {
  if (!req.user) {
    res
      .status(403)
      .send("You must be logged in as an admin user to access this resource.");
  } else if (!req.user.admin) {
    res.status(403).send("Only admin users can access this resource.");
  } else {
    next();
  }
};

module.exports = {
  checkAuth,
  checkAdmin,
};
