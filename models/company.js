const mongoose = require("mongoose");
const Joi = require("joi");

const compSchema = new mongoose.Schema({
  // vlidate data before writing to database
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  phone: { type: String, required: true },
});

function validateCompany(company) {
  // validate data send from client request
  const schema = Joi.array().items(
    Joi.object({
      id: Joi.string(),
      name: Joi.string().required(),
      address: Joi.string().required(),
      contact: Joi.string().required(),
      phone: Joi.string().required(),
    })
  );
  return schema.validate(company);
}

const Company = mongoose.model("Company", compSchema);

module.exports = { Company, validateCompany };
