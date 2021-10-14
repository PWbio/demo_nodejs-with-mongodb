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

module.exports = Comp;
