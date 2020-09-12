const { Schema, model } = require('mongoose')
const { MONGOOSE_KEYS } = require('./mongooseKeys')

/**
 * teams: {
 *      "attacking": {
 *          "player-123": {
 *              "performanceCategory-123": 123,
 *              "performanceCategory-456": 456
 *           }
 *      }
 * }
 */

const gameResultSchema = new Schema({
    gameId: {
        type: String,
        unique: true
    },
    gameStartedAt: Date,
    gameEndedAt: Date,
    teams: {
        type: Map,
        of: {
            type: Map,
            of: {
                type: Map,
                of: Number
            }
        }
    }
})

module.exports = model(MONGOOSE_KEYS.MODELS.GAME_RESULT, gameResultSchema)