const express = require("express");
const router = express.Router();
const debugGET = require("debug")("API:GET");
const debugPOST = require("debug")("API:POST");
const debugDELETE = require("debug")("API:DELETE");
const debugPUT = require("debug")("API:PUT");
const { Company, validateCompany } = require("../models/company");

router.get("/get", async (req, res) => {
  debugGET(req.session); // use "req.session.passport" to get deserialized user information
  debugGET(req.user); // or use 'req.user'

  try {
    const result = await Company.find().select({ __v: 0 }); // remove useless field
    res.send(result);
    debugGET(`retrive ${result.length} documents`);
  } catch (e) {
    res.status(404).send("data not found");
    debugGET(e.message);
  }
});

router.post("/post", async (req, res) => {
  // convert req.body to array for input validation
  const input = Array.isArray(req.body) ? req.body : [req.body];

  const { error } = validateCompany(input);

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

router.delete("/delete", async (req, res) => {
  // get the id from request
  const { id } = req.body;
  if (!id) return res.status(400).send("bad request: id is empty");

  // find the data with the id
  try {
    await Company.find({ _id: id });
    debugDELETE(id);
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

router.delete("/delete_all", async (req, res) => {
  try {
    const result = await Company.deleteMany({});
    debugDELETE(result);
    res.status(200).end();
  } catch (e) {
    return res.status(500).send("database error");
  }
});

router.put("/put", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("bad request: id is empty");

  // find the data with the id
  let doc;
  try {
    doc = await Company.findById(id);
    debugPUT(`found ${id}`);
  } catch (e) {
    return res.status(404).send("data not found");
  }

  const updateData = { ...req.body };
  delete updateData.id; // remove id field

  // update data with the id (query first)
  try {
    doc.set(updateData);
    const result = await doc.save();
    debugPUT(result);
    res.status(200).end();
  } catch (e) {
    return res.status(500).send("database error");
  }

  // update data with the id (update first)
  // try {
  //   const result = await Company.updateOne(
  //     { _id: id },
  //     {
  //       $set: { ...updateData },
  //     }
  //   );
  //   debugPUT(result);
  //   res.status(200).end();
  // } catch (e) {
  //   return res.status(500).send("database error");
  // }
});

module.exports = router;
