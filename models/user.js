const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  displayName: String,
  accessToken: String,
  dateAdded: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
