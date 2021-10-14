const mongoose = require("mongoose"); // object

// first write something to database, which will create collection automatically once we write some documents.
mongoose
  .connect("mongodb://localhost/compInfo")
  .then(() => console.log("Success: connected to MongoDB...")) // Debug module prefered!!!
  .catch((err) =>
    console.error("Fail: cannot connect to MongoDB", err.message)
  );

// define the datatype of documents
const compSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  phone: { type: String, required: true },
});

// compile schema into model (similar to class v.s. object)
const Comp = mongoose.model("Company", compSchema); // return a class

// GET
const getComp = async () => {
  return await Comp.find().select({ __v: 0 }); // remove useless field
};

// POST
const createComp = async (data) => {
  let result;
  if (Array.isArray(data)) {
    // multiple document
    result = await Comp.insertMany(data);
  } else {
    // single document
    const comp = new Comp(data); // new document
    result = await comp.save(); // upload document
  }
  return result;
};

// DELETE
const deleteComp = async (id) => {
  // find first one and delete that
  return await Comp.findByIdAndDelete({ _id: id });
};

const deleteAllComp = async () => {
  return await Comp.deleteMany({});
};

module.exports = {
  model: Comp,
  createComp,
  getComp,
  deleteComp,
  deleteAllComp,
};
