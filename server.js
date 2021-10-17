const express = require("express");
const app = express();
const path = require("path");
const helmet = require("helmet");
const Joi = require("joi");
const morgan = require("morgan");
const allowCORS = require("./middleware/allowCORS");
const { Company, User } = require("./mongoose");

const debugGET = require("debug")("API:GET");
const debugPOST = require("debug")("API:POST");
const debugDELETE = require("debug")("API:DELETE");
const debugPUT = require("debug")("API:PUT");
const debugLINE = require("debug")("API:LINE");

const session = require("express-session");
const passport = require("passport");
const LineStrategy = require("./LineStrategy");
const config = require("config");

// const isDev = app.get("env") === "development";
const isDev = false;
if (isDev) {
  app.use(morgan("tiny"));
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

passport.serializeUser(function (user, done) {
  debugLINE("serialize", user);
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  debugLINE("deserialize", id);
  User.findById(id, (err, user) => {
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
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ userId: profile.userId }, function (err, user) {
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

app.get("/line/login", passport.authenticate("line"));

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
    req.logIn(user, function (err) {
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

const validateData = (data) => {
  // input validation
  const schema = Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string().required(),
      address: Joi.string().required(),
      contact: Joi.string().required(),
      phone: Joi.string().required(),
    })
  );
  return schema.validate(data);
};

app.get("/get", async (req, res) => {
  try {
    const result = await Company.find().select({ __v: 0 }); // remove useless field
    res.send(result);
    debugGET(`retrive ${result.length} documents`);
  } catch (e) {
    res.status(404).send("data not found");
    debugGET(e.message);
  }
});

app.post("/post", async (req, res) => {
  // convert req.body to array for input validation
  const input = Array.isArray(req.body) ? req.body : [req.body];

  const { error } = validateData(input);

  if (error) {
    debugPOST(error);
    return res.status(400).send(error.details[0].message);
  }

  try {
    const result = await Company.insertMany(input);
    res.send(result);
    debugPOST(
      `create new company: ${
        Array.isArray(result) ? `${result.length} entries` : result.name
      }`
    );
  } catch (e) {
    res.status(500).send("database error");
    debugPOST(e.message);
  }
});

app.delete("/delete", async (req, res) => {
  // get the id from request
  const { id } = req.body;
  if (!id) return res.status(400).send("bad request: id is empty");
  debugDELETE(id);

  // find the data with the id
  try {
    await Company.find({ _id: id });
  } catch (e) {
    return res.status(404).send("data not found");
  }

  // delete data with the id
  try {
    const result = await Company.deleteOne({ _id: id });
    debugDELETE(result);
    res.status(200).end();
  } catch (e) {
    return res.status(500).send("database error");
  }
});

app.delete("/delete_all", async (req, res) => {
  try {
    const result = await Company.deleteMany({});
    debugDELETE(result);
    res.status(200).end();
  } catch (e) {
    return res.status(500).send("database error");
  }
});

app.put("/put", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("bad request: id is empty");
  debugPUT(`found ${id}`);

  // find the data with the id
  try {
    await Company.find({ _id: id });
  } catch (e) {
    return res.status(404).send("data not found");
  }

  // delete data with the id
  try {
    const updateData = { ...req.body };
    delete updateData.id;
    const result = await Company.updateOne(
      { _id: id },
      {
        $set: { ...updateData },
      },
      { new: true }
    );
    debugPUT(result);
    res.status(200).end();
  } catch (e) {
    return res.status(500).send("database error");
  }
});

app.get("*", function (req, res, next) {
  // IMPORTANT!!! Required for using both "react-router-dom" and "redirect path from Node" together.
  // Need to place after all API call.
  res.sendFile(path.join(__dirname, "./client/build/"));
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
