const { GameProfile } = require('../models/gameProfile')

function createGameProfile() {
    return function (req, res, next) {
        const gp = GameProfile(req.body)
    }
}