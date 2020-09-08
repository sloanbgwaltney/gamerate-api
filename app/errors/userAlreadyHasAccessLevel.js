class UserAlreadyHasAccessLevel extends Error {
    constructor(userId) {
        this.userId = userId
    }
}

module.exports = { UserAlreadyHasAccessLevel }