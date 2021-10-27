const OAuth2Strategy = require("passport-oauth2");
const { InternalOAuthError } = require("passport-oauth2");

class LineStrategy extends OAuth2Strategy {
  constructor(options, verify) {
    super(...arguments);
    this.verify = verify;
    this.options = options || {};
    this.options.authorizationURL =
      options.authorizationURL ||
      "https://access.line.me/oauth2/v2.1/authorize";
    this.options.tokenURL =
      options.tokenURL || "https://api.line.me/oauth2/v2.1/token";
    this.name = "line";
    this._oauth2.setAuthMethod("Bearer");
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  userProfile = (accessToken, done) => {
    this._oauth2.get(
      "https://api.line.me/v2/profile",
      accessToken,
      (err, body, res) => {
        if (err) {
          return done(
            new InternalOAuthError("failed to fetch user profile", err)
          );
        }
        try {
          const json = JSON.parse(body);
          const profile = { provider: "line" };
          profile.userId = json.userId;
          profile.displayName = json.displayName;
          profile._raw = body;
          profile._json = json;
          done(null, profile);
        } catch (e) {
          done(e);
        }
      }
    );
  };
}

module.exports = LineStrategy;
