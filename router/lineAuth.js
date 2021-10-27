const express = require("express");
const router = express.Router();
const passport = require("passport");
const debugLINE = require("debug")("API:LINE");
const isDev = require("../startup/devState");

router.get("/", passport.authenticate("line"), (req, res) => {});
router.get("/callback", (req, res, next) => {
  passport.authenticate("line", (err, user, info) => {
    // error return from LINE server (such as bad request)
    if (err) {
      debugLINE(err);
      debugLINE("LINE server return error");
      const queryString = new URL(req.url, "http://localhost:8080").search;

      // prevent redirect to 8080 in dev mode.
      return res.redirect(
        `${
          isDev ? "http://localhost:3000/login/failed" : "/login/failed"
        }${queryString}`
      );
    }

    // Authentification failed
    if (!user) {
      debugLINE("authentification failed");
      const params = new URLSearchParams({
        message: "authentication failed",
      });
      return res.redirect(
        `${
          isDev ? "http://localhost:3000/login/failed" : "/login/failed"
        }?${params.toString()}`
      );
    }

    // Establish session
    req.logIn(user, (err) => {
      if (err) {
        debugLINE("session login failed");

        const params = new URLSearchParams({
          message: "session login failed",
        });
        return res.redirect(
          `${
            isDev ? "http://localhost:3000/login/failed" : "/login/failed"
          }?${params.toString()}`
        );
      }
      debugLINE("session login succeeded");

      return res.redirect(isDev ? "http://localhost:3000/home" : "/home");
    });
  })(req, res, next);
});

module.exports = router;
