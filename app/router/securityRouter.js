const securityRouter = require('express').Router()
const { validateBody } = require('../lib/middleware')
const { login } = require('../controllers/securityController')
const { userAuthenticationSchema } = require('../validators/userValidators')
const { passport, PASSPORT_KEYS } = require('../config/passport')

securityRouter.post("/authenticate", passport.authenticate(PASSPORT_KEYS.LOCAL, { session: false }), validateBody(userAuthenticationSchema), login())

module.exports = { securityRouter }