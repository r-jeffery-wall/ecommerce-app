const { body, validationResult } = require("express-validator");

// For catching validation errors.
const catchErrors = async (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  }

  res.status(400).send({ errors: result.array() });
};

module.exports = {
  catchErrors,
};
