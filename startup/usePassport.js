const passport = require("passport");
const session = require("express-session");
const User = require("../models/user");
const config = require("config");
const LineStrategy = require("../oauth2/LineStrategy");
const debugLINE = require("debug")("API:LINE");

module.exports = function (app) {
  app.use(
    session({
      secret: "random unguessable secret string",
      resave: false,
      saveUninitialized: true,
      cookieName: "session",
    })
  );
  app.use(passport.initialize());
  app.use(passport.session()); //

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
};
