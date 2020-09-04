const { Schema, model } = require("mongoose");
const { performanceCategory } = require('./performanceCategory')

const gameProfileSchema = new Schema({
    name: {
        type: String
    },
    createDate: {
        type: Date
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdDate: {
        type: Date
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    lastUpdatedDate: {
        type: Date
    },
    performanceCategories: [performanceCategory]
})

const GameProfile = model('gameprofile', gameProfileSchema)

module.exports = { GameProfile }