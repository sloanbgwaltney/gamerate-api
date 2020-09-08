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

gameProfileSchema.methods.create = async function (userId) {
    this.createdDate = new Date()
    this.createdBy = userId
    this.lastUpdatedBy = userId
    this.lastUpdatedDate = new Date()
    return this.save()
}

gameProfileSchema.statics.getByCreationUser = async function (userId) {
    return this.model('gameprofile').find({ createdBy: userId })
}

const GameProfile = model('gameprofile', gameProfileSchema)

module.exports = { GameProfile }