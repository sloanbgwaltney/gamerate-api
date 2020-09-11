const { Schema } = require('mongoose')
function userAccessLevelPlugin(schema, options = {}) {
    const defaultOptions = { pathName: 'usersAccess', userModelRef: 'user' }
    const finalOptions = Object.assign(defaultOptions, options)

    schema.add({
        [finalOptions.pathName]: {
            type: Map,
            of: {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: finalOptions.userModelRef
                },
                accessLevel: Number
            }
        }
    })

    schema.methods.createUserAccess = function (addedUserId, level) {
        if (!this[finalOptions.pathName]) this[finalOptions.pathName] = new Map()
        this[finalOptions.pathName].set(addedUserId, { user: addedUserId, accessLevel: level })
    }

    schema.methods.getUserAccess = function (userId) {
        if (!this[finalOptions.pathName]) return null
        return this[finalOptions.pathName].get(userId)
    }

    schema.methods.hasAtLeastLevelAccess = function (level, userId) {
        if (!this[finalOptions.pathName]) return false
        const userAccess = this[finalOptions.pathName].get(userId)
        if (!userAccess) return false
        return userAccess.accessLevel >= level
    }
}

module.exports = { userAccessLevelPlugin }