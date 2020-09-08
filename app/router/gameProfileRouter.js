const gameProfileRouter = require('express').Router()
const { createGameProfile, createPerformanceCategory } = require('../controllers/gameProfileController')
const { passport } = require('../config/passport')
const { fetchEntity } = require('../lib/fetchEntity')
const { GameProfile } = require('../models/gameProfile')
const { validateBody } = require('../lib/validateBody')
const { createPerformanceCategorySchema } = require('../validators/performanceCategoryValidators')

gameProfileRouter.post('', passport.authenticate('jwt', { session: false }), createGameProfile())
gameProfileRouter.post(
    '/:gameProfileId/performanceCategory',
    passport.authenticate('jwt', { session: false }),
    fetchEntity(GameProfile, 'gameProfileId', 'gameProfile'),
    validateBody(createPerformanceCategorySchema),
    createPerformanceCategory()
)
module.exports = { gameProfileRouter }