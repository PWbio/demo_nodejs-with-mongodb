const mongoose = require("mongoose"); // object

// first write something to database, which will create collection automatically once we write some documents.
mongoose
  .connect("mongodb://localhost/shopInfo")
  .then(() => console.log("Success: connected to MongoDB...")) // Debug module prefered!!!
  .catch((err) =>
    console.error("Fail: cannot connect to MongoDB", err.message)
  );

// define the datatype of documents
const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  phone: { type: String, required: true },
});

// compile schema into model (similar to class v.s. object)
const Shop = mongoose.model("Shop", shopSchema); // return a class

const createShop = async ({ name, address, contact, phone }) => {
  const shop = new Shop({ name, address, contact, phone }); // new document
  const result = await shop.save(); // upload document
  return result;
};

const getShop = async () => {
  return await Shop.find().select({ __v: 0 });
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

// const removeCourse = async (id) => {
//   // find first one and delete that
//   // deleteMany
//   const result = await Course.findByIdAndDelete({ _id: id });

//   console.log(result);
// };

// createCourse();

module.exports = {
  createShop,
  getShop,
};
