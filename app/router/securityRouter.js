const securityRouter = require('express').Router()
const { validateBody } = require('../lib/validateBody')
const { login, refresh } = require('../controllers/securityController')
const { userAuthenticationSchema } = require('../validators/userValidators')

securityRouter.post("/authenticate", validateBody(userAuthenticationSchema), login())
securityRouter.post("/refresh", refresh())

module.exports = { securityRouter }