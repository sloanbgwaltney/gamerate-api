const gameProfileRouter = require('express').Router()
const { createGameProfile, createPerformanceCategory } = require('../controllers/gameProfileController')
const { passport, PASSPORT_KEYS } = require('../config/passport')
const { fetchEntity } = require('../lib/fetchEntity')
const { GameProfile } = require('../models/gameProfile')
const { validateBody } = require('../lib/validateBody')
const { createPerformanceCategorySchema } = require('../validators/performanceCategoryValidators')
const { isAuthorized } = require('../lib/isAuthorized')

gameProfileRouter.post('', passport.authenticate('jwt', { session: false }), createGameProfile())
gameProfileRouter.post(
    '/:gameProfileId/performanceCategory',
    passport.authenticate(PASSPORT_KEYS.JWT, { session: false }),
    fetchEntity(GameProfile, req => req.params.gameProfileId, (req, res, entity) => req.entities.gameProfile = entity),
    isAuthorized((req, res) => {
        if (!req.entities.gameProfile) return false; return req.entities.gameProfile.hasAtLeastLevelAccess(2, req.user.id)
    }, 'Must have level 2 access to this game profile to create a performance category'),
    validateBody(createPerformanceCategorySchema),
    createPerformanceCategory()
)
module.exports = { gameProfileRouter }