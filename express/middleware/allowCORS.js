/**
 * @function allowCORS
 * @description Add a middleware function to allow CORS.
 * @description In dev environment, we use localhost with different port # from client (3000) and server (8080)
 */
// Add a middleware function to allow CORS
//
const allowCORS = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

module.exports = allowCORS;
