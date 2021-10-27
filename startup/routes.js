const express = require("express");
const path = require("path");
const useSecurity = require("./security.js");
const usePassport = require("./passport"); // a function

const company = require("../router/company");
const lineAuth = require("../router/lineAuth");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.static("client/build")); // to server compiled React page.
  useSecurity(app);
  usePassport(app);
  app.use("/api", company);
  app.use("/line/login", lineAuth);
  app.get("*", (req, res) => {
    // IMPORTANT!!! This is required for using both "react-router-dom" and "express" together.
    // This should be placed after all API endpoints.
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
};
