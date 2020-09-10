const { Schema, model } = require("mongoose");
const { performanceCategory } = require('./performanceCategory')
const { userAccessSchema } = require('./userAccess');
const { UserAlreadyHasAccessLevel } = require("../errors/userAlreadyHasAccessLevel");

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
    performanceCategories: {
        type: Map,
        of: performanceCategory
    },
    usersAccess: {
        type: Map,
        of: userAccessSchema
    }
})

gameProfileSchema.statics.getByCreationUser = async function (userId) {
    return this.model('gameprofile').find({ createdBy: userId })
}

gameProfileSchema.methods.create = async function (userId) {
    this.createdDate = new Date()
    this.createdBy = userId
    this.lastUpdatedBy = userId
    this.lastUpdatedDate = this.createdDate
    this.createUserAccess(userId, userId, 3)
    return this.save()
}

gameProfileSchema.methods.createUserAccess = async function (currentUserId, addedUserId, level) {
    if (!this.usersAccess) this.usersAccess = new Map()
    const addedUser = this.getUserAccess(addedUserId)
    if (addedUser) throw new UserAlreadyHasAccessLevel(addedUser.id)
    const date = new Date()
    const userAccess = {
        accessLevel: level,
        user: currentUserId,
        addedDate: date,
        addeddBy: addedUserId,
        lastUpdatedDate: date,
        lastUpdatedBy: addedUserId
    }
    this.usersAccess.set(addedUserId, userAccess)
}


gameProfileSchema.methods.getUserAccess = function (userId) {
    if (!this.usersAccess) return null
    return this.usersAccess.get(userId)
}

gameProfileSchema.methods.createPerformanceCategory = async function (pc, userId) {
    pc.createdDate = new Date()
    pc.createdBy = userId
    pc.lastUpdatedBy = userId
    pc.lastUpdatedDate = pc.createdDate
    if (!this.performanceCategories) this.performanceCategories = new Map()
    this.performanceCategories.set(pc.name, pc)
}

gameProfileSchema.methods.hasAtLeastLevelAccess = function (level, userId) {
    if (!this.usersAccess) return false
    const userAccess = this.usersAccess.get(userId)
    return userAccess.accessLevel >= level
}

const GameProfile = model('gameprofile', gameProfileSchema)

module.exports = { GameProfile }