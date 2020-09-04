const userRouter = require('express').Router()
const { createUser } = require('../controllers/userController')
const { validateBody } = require('../lib/validateBody')
const { createUserValidator } = require('../validators/userValidators')

userRouter.post("", validateBody(createUserValidator), createUser())

module.exports = { userRouter }