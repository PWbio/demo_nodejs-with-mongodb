const Joi = require("joi");

const validObjectId = (id) => {
  return Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .validate(id);
};

module.exports = (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Empty objectId.");

  const { error } = validObjectId(id);
  if (error) return res.status(400).send("Invalid objectId.");

  next();
};
