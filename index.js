const express = require("express");
const app = express();

require("./startup/logging").initialize(app);
require("./startup/routes")(app);
require("./startup/db")();

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
