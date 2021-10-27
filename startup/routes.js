const express = require("express");
const path = require("path");
const helmet = require("helmet");
const allowCORS = require("../middleware/allowCORS");
const isDev = require("../startup/devState");
const company = require("../router/company");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.static("client/build")); // to server compiled React page.
  app.use(
    helmet({
      // safari forces SSL (https) to request resource (CSS/JS) if turning on.
      contentSecurityPolicy: false,
    })
  );
  if (isDev) app.use(allowCORS);
  app.use("/api", company);
  app.get("*", (req, res) => {
    // IMPORTANT!!! This is required for using both "react-router-dom" and "express" together.
    // This should be placed after all API endpoints.
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
};
