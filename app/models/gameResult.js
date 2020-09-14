const { Schema, model } = require('mongoose')
const { MONGOOSE_KEYS } = require('./mongooseKeys')

/**
 * teams: {
 *      "attacking": {
 *          "player-123": {
 *              "performance": {
 *                  "performanceCategory-123": 123,
 *                  "performanceCategory-456": 456
 *               },
 *               policy: "scoringPolicy-123"
 *           }
 *      }
 * }
 */

const gameResultSchema = new Schema({
    gameId: {
        type: String,
        unique: true
    },
    gameProfile: {
        type: Schema.Types.ObjectId,
        ref: MONGOOSE_KEYS.MODELS.GAME_PROFILE
    },
    gameStartedAt: Date,
    gameEndedAt: Date,
    teams: {
        type: Map,
        of: {
            type: Map,
            of: {
                type: Map,
                of: {
                    performance: {
                        type: Map,
                        of: Number
                    },
                    policy: String
                }
            }
        }
    }
})

gameResultSchema.methods.validateGameProfile = async function () {

}

const GameResult = model(MONGOOSE_KEYS.MODELS.GAME_RESULT, gameResultSchema)

module.exports = { GameResult }