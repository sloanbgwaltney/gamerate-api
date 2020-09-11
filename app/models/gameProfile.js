const { Schema, model } = require("mongoose");
const { performanceCategory } = require('./performanceCategory')
const { userAccessSchema } = require('./userAccess');
const { UserAlreadyHasAccessLevel } = require("../errors/userAlreadyHasAccessLevel");
const { MONGOOSE_KEYS } = require('./mongooseKeys')
const { convertPlainObjectToMap } = require('../lib/convertPlainObjToMap')
const { InvalidPerformanceCategoryName } = require('../errors/invalidPerformanceCategoryName')
const { InvalidScoringTotal } = require('../errors/invalidScoringTotal')
const { scoringPolicySchema } = require('./scoringPolicy');
const { NameTaken } = require("../errors/nameTaken");

const gameProfileSchema = new Schema({
    name: {
        type: String
    },
    createDate: {
        type: Date
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: MONGOOSE_KEYS.MODELS.USER
    },
    createdDate: {
        type: Date
    },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: MONGOOSE_KEYS.MODELS.USER
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
    },
    scoringPolicies: {
        type: Map,
        of: scoringPolicySchema
    }
})

gameProfileSchema.statics.getByCreationUser = async function (userId) {
    return this.model(MONGOOSE_KEYS.MODELS.GAME_PROFILE).find({ createdBy: userId })
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
    if (!userAccess) return false
    return userAccess.accessLevel >= level
}

gameProfileSchema.methods.createScoringPolicy = function (scoringPolicy) {
    scoringPolicy.weights = convertPlainObjectToMap(scoringPolicy.weights)
    this.validateScoringPolicy(scoringPolicy)
    this.scoringPolicies.set(scoringPolicy.name, scoringPolicy)
}

gameProfileSchema.methods.validateScoringPolicy = function (scoringPolicy) {
    if (!this.scoringPolicies) this.scoringPolicies = new Map()
    if (this.scoringPolicies.get(scoringPolicy.name)) throw new NameTaken(scoringPolicy.name, 'Scoring Policy')
    let total = 0
    scoringPolicy.weights.forEach((value, key, policy) => {
        if (!this.performanceCategories.get(key)) throw new InvalidPerformanceCategoryName(key)
        total += value
        if (total > 100) throw new InvalidScoringTotal(total)
    }, this)
    if (total !== 100) throw new InvalidScoringTotal(total)
}

const GameProfile = model(MONGOOSE_KEYS.MODELS.GAME_PROFILE, gameProfileSchema)

module.exports = { GameProfile }