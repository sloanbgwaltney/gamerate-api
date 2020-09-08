const { GameProfile } = require('../models/gameProfile')
const createError = require('http-errors')

function createGameProfile() {
    return async function (req, res, next) {
        try {
            const gp = new GameProfile(req.body)
            const result = await gp.create(req.user.id)
            res.status(201).json({ gameProfile: result })
            next()
        } catch (e) {
            next(createError(500))
        }
    }
}

module.exports = { createGameProfile }