const mongoose = require("mongoose");
const { defaultLogger } = require("./logging");

// mongoose will create collection automatically once we write some documents.
module.exports = function () {
  mongoose
    .connect("mongodb://localhost/database")
    .then(() => defaultLogger.info("Connected to MongoDB..."));
};
