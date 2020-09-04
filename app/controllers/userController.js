const { User } = require("../models/user");
const { hash } = require('bcryptjs')
const createError = require('http-errors')

function createUser() {
  return async function (req, res, next) {
    try {
      const user = User(req.body);
      const uniqueUserCheck = await User.find({ $or: [{ username: user.username }, { email: user.email }] })
      if (uniqueUserCheck.length > 0) return next(createError(409, 'Username or email already in use'))
      user.password = await hash(user.password, 10)
      const savedUser = await user.save()
      // so that we can hide the hash from the user
      savedUser.password = undefined
      res.status(201).json(savedUser)
      next()
    } catch (e) {
      next(createError(500))
    }
  };
}

module.exports = { createUser }