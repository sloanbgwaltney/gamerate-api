const securityRouter = require('express').Router()
const { validateBody } = require('../lib/validateBody')
const { login } = require('../controllers/securityController')
const { userAuthenticationSchema } = require('../validators/userValidators')

securityRouter.post("/authenticate", validateBody(userAuthenticationSchema), login())

module.exports = { securityRouter }