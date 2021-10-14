const express = require("express");
const app = express();
const allowCORS = require("./middleware/allowCORS");
const db = require("./mongodb");
const debugGET = require("debug")("API:GET");
const debugPOST = require("debug")("API:POST");
const debugDELETE = require("debug")("API:DELETE");

app.use(express.json());
app.use(allowCORS);

app.get("/", async (req, res) => {
  try {
    const result = await db.getComp();
    res.send(result);
    debugGET(`retrive ${result.length} documents`);
  } catch (e) {
    res.status(404).send("data not found");
    debugGET(e.message);
  }
});

app.post("/", async (req, res) => {
  try {
    const result = await db.createComp(req.body);
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

app.delete("/", async (req, res) => {
  // locate the id
  try {
    const company = await db.model.find({ _id: req.body.id });
    debugDELETE(company);
  } catch (e) {
    res.status(404).send("Not found");
  }

  // delete that id
  try {
    const result = await db.deleteComp(req.body.id);
    res.send(result);
  } catch (e) {
    res.status(500).send("database error");
    debugDELETE(e.message);
  }
});

app.delete("/delete_all", async (req, res) => {
  console.log(111);
  const result = await db.deleteAllComp();
  console.log(result);
  res.send(result);
});

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
