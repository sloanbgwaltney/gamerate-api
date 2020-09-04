const joi = require("joi");

const createUserValidator = joi.object({
  username: joi.string().min(8).max(64).required(),
  password: joi.string().min(8).max(64).required(),
  email: joi.string().email().required(),
});

module.exports = { createUserValidator };
