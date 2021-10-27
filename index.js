const express = require("express");
const app = express();

const { defaultLogger } = require("./startup/logging").initialize(app);
require("./startup/routes")(app);
require("./startup/db")();

const port = 8080;
app.listen(port, () => defaultLogger.info(`Listening on port ${port} ...`));
