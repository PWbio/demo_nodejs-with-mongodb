const express = require("express");
const app = express();
const allowCORS = require("./middleware/allowCORS");
const db = require("./mongodb");
const debugGET = require("debug")("API:GET");
const debugPOST = require("debug")("API:POST");
const debugDELETE = require("debug")("API:DELETE");
const debugPUT = require("debug")("API:PUT");

app.use(express.json());
app.use(allowCORS);

app.get("/", async (req, res) => {
  try {
    const result = await db.find().select({ __v: 0 }); // remove useless field
    res.send(result);
    debugGET(`retrive ${result.length} documents`);
  } catch (e) {
    res.status(404).send("data not found");
    debugGET(e.message);
  }
});

app.post("/", async (req, res) => {
  try {
    let result;
    if (Array.isArray(req.body)) {
      // multiple document
      result = await db.insertMany(req.body);
    } else {
      // single document
      const document = new db(req.body);
      result = await document.save();
    }
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
  // get the id from request
  const { id } = req.body;
  if (!id) return res.status(400).send("bad request: id is empty");
  debugDELETE(id);

  // find the data with the id
  try {
    await db.find({ _id: id });
  } catch (e) {
    return res.status(404).send("data not found");
  }

  // delete data with the id
  try {
    const result = await db.deleteOne({ _id: id });
    debugDELETE(result);
    res.status(200).end();
  } catch (e) {
    return res.status(500).send("database error");
  }
});

app.delete("/delete_all", async (req, res) => {
  try {
    const result = await db.deleteMany({});
    debugDELETE(result);
    res.status(200).end();
  } catch (e) {
    return res.status(500).send("database error");
  }
});

app.put("/", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("bad request: id is empty");
  debugPUT(id);

  // find the data with the id
  try {
    await db.find({ _id: id });
  } catch (e) {
    return res.status(404).send("data not found");
  }

  // delete data with the id
  try {
    const updateData = { ...req.body };
    delete updateData.id;
    const result = await db.updateOne(
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

const port = 8080;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
