const gameProfileRouter = require('express').Router()
const { createGameProfile, createPerformanceCategory } = require('../controllers/gameProfileController')
const { passport, PASSPORT_KEYS } = require('../config/passport')
const { fetchEntity } = require('../lib/fetchEntity')
const { GameProfile } = require('../models/gameProfile')
const { validateBody } = require('../lib/validateBody')
const { createPerformanceCategorySchema } = require('../validators/performanceCategoryValidators')

gameProfileRouter.post('', passport.authenticate('jwt', { session: false }), createGameProfile())
gameProfileRouter.post(
    '/:gameProfileId/performanceCategory',
    passport.authenticate(PASSPORT_KEYS.JWT, { session: false }),
    fetchEntity(GameProfile, 'gameProfileId', 'gameProfile'),
    passport.authenticate(PASSPORT_KEYS.GAME_PRFILE.LEVEL2, { session: false }),
    validateBody(createPerformanceCategorySchema),
    createPerformanceCategory()
)
module.exports = { gameProfileRouter }