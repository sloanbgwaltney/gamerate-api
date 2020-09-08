const gameProfileRouter = require('express').Router()
const { createGameProfile } = require('../controllers/gameProfileController')
const { passport } = require('../config/passport')

gameProfileRouter.post('', passport.authenticate('jwt', { session: false }), createGameProfile())

module.exports = { gameProfileRouter }