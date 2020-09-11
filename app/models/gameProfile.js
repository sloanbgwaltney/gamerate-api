const { Schema, model } = require("mongoose");
const { performanceCategory } = require('./performanceCategory')
const { MONGOOSE_KEYS } = require('./mongooseKeys')
const { convertPlainObjectToMap } = require('../lib/convertPlainObjToMap')
const { InvalidPerformanceCategoryName } = require('../errors/invalidPerformanceCategoryName')
const { InvalidScoringTotal } = require('../errors/invalidScoringTotal')
const { scoringPolicySchema } = require('./scoringPolicy');
const { NameTaken } = require("../errors/nameTaken");
const { userAccessLevelPlugin } = require('../lib/mongoosePlugins/userAccessLevelPlugin')
const { createUpdateMetadataPlugin } = require('../lib/mongoosePlugins/createUpdateMetadataPlugin')
const gameProfileSchema = new Schema({
    name: {
        type: String
    },
    performanceCategories: {
        type: Map,
        of: performanceCategory
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
    this.setCreateEditMetadata(this, userId, true)
    this.createUserAccess(userId, 3)
    const ua = this.setCreateEditMetadata(this.usersAccess.get(userId), userId, true)
    this.usersAccess.set(userId, ua)
    return this.save()
}

gameProfileSchema.methods.createPerformanceCategory = async function (pc, userId) {
    pc.createdDate = new Date()
    pc.createdBy = userId
    pc.lastUpdatedBy = userId
    pc.lastUpdatedDate = pc.createdDate
    if (!this.performanceCategories) this.performanceCategories = new Map()
    this.performanceCategories.set(pc.name, pc)
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

gameProfileSchema.plugin(userAccessLevelPlugin)
gameProfileSchema.plugin(createUpdateMetadataPlugin)

console.log(gameProfileSchema.path('usersAccess'))
const GameProfile = model(MONGOOSE_KEYS.MODELS.GAME_PROFILE, gameProfileSchema)

module.exports = { GameProfile }