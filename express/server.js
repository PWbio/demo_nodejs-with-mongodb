const express = require("express");
const app = express();
const allowCORS = require("./middleware/allowCORS");
const db = require("./mongodb");
const debugGET = require("debug")("API:GET");
const debugPOST = require("debug")("API:POST");

app.use(express.json());
app.use(allowCORS);

app.get("/", async (req, res) => {
  try {
    const result = await db.getShop(req.body);
    res.send(result);
    debugGET(`retrive ${result.length} documents`);
  } catch (e) {
    res.status(404).send("data not found");
    debugGET(e.message);
  }
});

app.post("/", async (req, res) => {
  try {
    const result = await db.createShop(req.body);
    res.send(`data received ${result._id}`);
    debugPOST(`create new shop: ${result.name}`);
  } catch (e) {
    res.status(500).send("database error");
    debugPOST(e.message);
  }
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
