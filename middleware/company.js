const { validate } = require("../models/company");
const { httpLogger } = require("../startup/logging");

module.exports = (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    httpLogger.error(error);
    return res.status(400).send(error.details[0].message);
  }

  next();
};
