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

// PUT
const updateComp = async () => {
  // Look up the course
  // If not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Not found");

  // Validate
  const { error } = validateCourse(req.body);

  // If invalid, return 400 - Bad request
  if (error) return res.status(400).send(error.details[0].message);

  // Update course
  course.name = req.body.name;

  // Return the updated course
  res.send(course);
};

module.exports = Comp;
