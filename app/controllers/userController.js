const { User } = require("../models/user");
const createError = require('http-errors')

function createUser() {
  return async function (req, res, next) {
    try {
      const user = User(req.body);
      if (await user.isUnqiueUser() === false) return next(createError(409, 'Username or email already in use'))
      await user.hashPassword()
      const savedUser = await user.saveAndReturnSanitized()
      res.status(201).json(savedUser)
      next()
    } catch (e) {
      console.log(e)
      next(createError(500))
    }
  };
}

module.exports = { createUser }