const { Schema, model } = require("mongoose");
const { performanceCategory } = require('./performanceCategory')
const { MONGOOSE_KEYS } = require('./mongooseKeys')
const { InvalidPerformanceCategoryNameError, InvalidScoringTotalError, NameTakenError } = require('../errors/errors')
const { convertPlainObjectToMap } = require('../lib/util')
const { scoringPolicySchema } = require('./scoringPolicy');
const { userAccessLevelPlugin } = require('../lib/mongoosePlugins/userAccessLevelPlugin')
const { createUpdateMetadataPlugin } = require('../lib/mongoosePlugins/createUpdateMetadataPlugin')
const { Types } = require('mongoose')

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
    pc.createdAt = new Date()
    pc.createdBy = userId
    pc.lastUpdatedBy = userId
    pc.lastUpdatedAt = pc.createdAt
    if (!this.performanceCategories) this.performanceCategories = new Map()
    pc._id = Types.ObjectId()
    this.performanceCategories.set(pc._id.toString(), pc)
}

gameProfileSchema.methods.createScoringPolicy = function (scoringPolicy) {
    scoringPolicy.weights = convertPlainObjectToMap(scoringPolicy.weights)
    this.validateScoringPolicy(scoringPolicy)
    this.scoringPolicies.set(scoringPolicy.name, scoringPolicy)
}

gameProfileSchema.methods.validateScoringPolicy = function (scoringPolicy) {
    if (!this.scoringPolicies) this.scoringPolicies = new Map()
    if (this.scoringPolicies.get(scoringPolicy.name)) throw new NameTakenError(scoringPolicy.name, 'Scoring Policy')
    let total = 0
    scoringPolicy.weights.forEach((value, key, policy) => {
        if (!this.performanceCategories.get(key)) throw new InvalidPerformanceCategoryNameError(key)
        total += value
        if (total > 100) throw new InvalidScoringTotalError(total)
    }, this)
    if (total !== 100) throw new InvalidScoringTotalError(total)
}


gameProfileSchema.statics.getUsersGameProfiles = async function (userId, opts = {}) {
    const defaultOpts = {
        sortBy: 'name',
        sortType: 'descending',
        resultsPerPage: 20,
        page: 1
    }
    const finalOptions = Object.assign(defaultOpts, opts)
    const sortOperation = finalOptions.sortType == 'descending' ? '-' : '+'
    const results = await this.find({ [`usersAccess.${userId}`]: { $exists: true } })
        .limit(finalOptions.resultsPerPage)
        .sort(`${sortOperation}${finalOptions.sortBy}`)
        .skip(finalOptions.resultsPerPage * (finalOptions.page - 1))
    results.forEach(res => res.sanitize(userId))
    return results
}

gameProfileSchema.methods.sanitize = async function (userId) {
    sanitizeUsersAccess(this, userId)
}

function sanitizeUsersAccess(gp, userId) {
    const userAccess = gp.usersAccess.get(userId)
    if (userAccess.accessLevel === 3) return
    gp.usersAccess = new Map()
    gp.usersAccess.set(userId, this.usersAccess)
}

gameProfileSchema.plugin(userAccessLevelPlugin)
gameProfileSchema.plugin(createUpdateMetadataPlugin)

const GameProfile = model(MONGOOSE_KEYS.MODELS.GAME_PROFILE, gameProfileSchema)

module.exports = { GameProfile }