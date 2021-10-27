const express = require("express");
const app = express();

require("./startup/logging").initialize(app);
require("./startup/db")();

const path = require("path");
const helmet = require("helmet");
const allowCORS = require("./middleware/allowCORS");
const User = require("./models/user");

const debugLINE = require("debug")("API:LINE");

const session = require("express-session");
const passport = require("passport");
const LineStrategy = require("./LineStrategy");
const config = require("config");

const company = require("./router/company");

const isDev = app.get("env") === "development";
// const isDev = false;
if (isDev) {
  app.use(allowCORS);
}

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false, // safari forces SSL (https) to request resource (CSS/JS) if turning on.
  })
);
app.use(express.static("client/build")); // to server compiled React page.

app.use(
  session({
    secret: "random unguessable secret string",
    resave: false,
    saveUninitialized: true,
    cookieName: "session",
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  debugLINE("serialize", user);
  done(null, user);
});
passport.deserializeUser((user, done) => {
  debugLINE("deserialize", user._id);
  User.findById(user._id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LineStrategy(
    {
      authorizationURL: "https://access.line.me/oauth2/v2.1/authorize",
      tokenURL: "https://api.line.me/oauth2/v2.1/token",
      clientID: config.get("clientID"),
      clientSecret: config.get("clientSecret"),
      callbackURL: "http://localhost:8080/line/login/callback",
      state: config.get("state"),
      scope: ["profile"],
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ userId: profile.userId }, (err, user) => {
        if (err) {
          return cb(err);
        }
        if (!user) {
          //No user was found, create one.
          user = new User({
            userId: profile.userId,
            displayName: profile.displayName,
            accessToken,
            refreshToken,
          });
          user.save((err) => {
            if (err) return cb(err, user);
          });
        } else {
          //found user. Return.
          return cb(err, user);
        }
      });
    }
  )
);

app.get("/line/login", passport.authenticate("line"), (req, res) => {});

app.get("/line/login/callback", (req, res, next) => {
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

app.use("/api", company);

app.get("*", (req, res) => {
  // IMPORTANT!!! This is required for using both "react-router-dom" and "express" together.
  // This should be placed after all API endpoints.
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
