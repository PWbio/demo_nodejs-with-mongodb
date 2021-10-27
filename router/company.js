const express = require("express");
const router = express.Router();
const { httpLogger } = require("../startup/logging");
const { Company } = require("../models/company");
const company = require("../middleware/company");
const objectId = require("../middleware/objectId");

router.get("/", async (req, res) => {
  const obj = await Company.find().select({ __v: 0 }).sort("name"); // remove version
  httpLogger.verbose(`retrieve ${obj.length} documents`);
  res.send(obj);
});

router.post("/", company, async (req, res) => {
  const obj = await Company.insertMany(req.body);
  httpLogger.verbose(`create new company: ${obj.length} entries`);
  res.send(obj);
});

router.delete("/one/:id", objectId, async (req, res) => {
  const { id } = req.params;
  const obj = await Company.findByIdAndRemove({ _id: id });
  if (!obj)
    return res.status(404).send("The company with the given ID was not found.");
  httpLogger.verbose(`delete ${id}`);
  res.send(obj);
});

router.delete("/all", async (req, res) => {
  await Company.deleteMany({});
  res.status(200).send("Removed all entries.");
});

router.put("/one/:id", objectId, company, async (req, res) => {
  const { id } = req.params;
  const obj = await Company.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    { returnDocument: "after" }
  );
  res.send(obj);
});

module.exports = router;
