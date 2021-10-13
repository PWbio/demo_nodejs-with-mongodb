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

const createComp = async ({ name, address, contact, phone }) => {
  const comp = new Comp({ name, address, contact, phone }); // new document
  const result = await comp.save(); // upload document
  return result;
};

const getComp = async () => {
  return await Comp.find().select({ __v: 0 });
};

const deleteComp = async (id) => {
  // find first one and delete that
  return await Comp.findByIdAndDelete({ _id: id });
};

// const getCourse = async () => {
//   // /api/courses?pageNumber=2&pageSize=10
//   const pageNumber = 2;
//   const pageSize = 10;

//   const courses = await Course.find({ author: "Po", isPublished: true })
//     .skip((pageNumber - 1) * pageSize) // skip all documents in previous pages (not index)
//     .limit(pageSize)
//     .sort({ name: 1 })
//     .select({ name: 1, tags: 1 });

//   console.log(courses);
// };

// const updateCourse = async (id) => {
//   const result = await Course.findByIdAndUpdate(
//     id,
//     {
//       $set: {
//         author: "Po",
//         isPublished: false,
//       },
//     },
//     { new: true }
//   );

//   console.log(result);
// };

// createCourse();

module.exports = {
  model: Comp,
  createComp,
  getComp,
  deleteComp,
};
