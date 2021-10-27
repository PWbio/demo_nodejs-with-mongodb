const { httpLogger } = require("../startup/logging");

module.exports = function (err, req, res, next) {
  httpLogger.error(err);
  res.status(500).send(err.message);
};
