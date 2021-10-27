/**
 * @description A middleware function to allow CORS.
 * @description In dev environment, we use localhost with port 3000 for client and 8080 for server, which is considered different origin.
 */
// Add a middleware function to allow CORS
//
module.exports = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
