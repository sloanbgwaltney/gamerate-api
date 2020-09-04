const joi = require("joi");

const usernameMin = 8
const usernameMax = 64
const passwordMin = 8
const passwordMax = 64

const createUserValidator = joi.object({
  username: joi.string().min(usernameMin).max(usernameMax).required(),
  password: joi.string().min(passwordMin).max(passwordMax).required(),
  email: joi.string().email().required(),
});

const userAuthenticationSchema = joi.object({
  username: joi.string().min(usernameMin).max(usernameMax).required(),
  password: joi.string().min(passwordMin).max(passwordMax).required(),
})

module.exports = { createUserValidator, userAuthenticationSchema };
