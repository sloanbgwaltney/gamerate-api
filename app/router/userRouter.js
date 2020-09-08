const userRouter = require('express').Router()
const { createUser, getGameProfilesCreatedByUser } = require('../controllers/userController')
const { validateBody } = require('../lib/validateBody')
const { createUserValidator } = require('../validators/userValidators')
const { passport } = require('../config/passport')

userRouter.post("", validateBody(createUserValidator), createUser())
userRouter.get("/createdGameProfiles", passport.authenticate('jwt', { session: false }), getGameProfilesCreatedByUser())
module.exports = { userRouter }