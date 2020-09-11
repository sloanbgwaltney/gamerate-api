const { Schema, model } = require("mongoose");
const { performanceCategory } = require('./performanceCategory')
const { MONGOOSE_KEYS } = require('./mongooseKeys')
const { convertPlainObjectToMap } = require('../lib/convertPlainObjToMap')
const { InvalidPerformanceCategoryName } = require('../errors/invalidPerformanceCategoryName')
const { InvalidScoringTotal } = require('../errors/invalidScoringTotal')
const { scoringPolicySchema } = require('./scoringPolicy');
const { NameTaken } = require("../errors/nameTaken");
const { userAccessLevelPlugin } = require('../lib/mongoosePlugins/userAccessLevelPlugin')

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
    console.log(this.createUserAccess)
    this.createUserAccess(userId, 3)
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
const GameProfile = model(MONGOOSE_KEYS.MODELS.GAME_PROFILE, gameProfileSchema)

module.exports = { GameProfile }