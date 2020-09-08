const securityRouter = require('express').Router()
const { validateBody } = require('../lib/validateBody')
const { login } = require('../controllers/securityController')
const { userAuthenticationSchema } = require('../validators/userValidators')
const { passport } = require('../config/passport')

securityRouter.post("/authenticate", passport.authenticate('local', { session: false }), validateBody(userAuthenticationSchema), login())

module.exports = { securityRouter }