const helmet = require("helmet");
const allowCORS = require("../middleware/allowCORS");
const isDev = require("../startup/devState");

module.exports = function (app) {
  app.use(
    helmet({
      // safari forces SSL (https) to request resource (CSS/JS) if turning on.
      contentSecurityPolicy: false,
    })
  );
  if (isDev) app.use(allowCORS);
};
