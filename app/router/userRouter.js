const userRouter = require('express').Router()
const { createUser, getGameProfilesCreatedByUser } = require('../controllers/userController')
const { validateBody } = require('../lib/middleware')
const { createUserValidator } = require('../validators/userValidators')
const { passport, PASSPORT_KEYS } = require('../config/passport')

userRouter.post("", validateBody(createUserValidator), createUser())
userRouter.get("/createdGameProfiles", passport.authenticate(PASSPORT_KEYS.JWT, { session: false }), getGameProfilesCreatedByUser())
module.exports = { userRouter }