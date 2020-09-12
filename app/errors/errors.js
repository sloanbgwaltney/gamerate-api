class InvalidPerformanceCategoryNameError extends Error {
    categoryName
    constructor(categoryName) {
        super(`A invalid performance name: ${categoryName} was provided`)
        this.categoryName = categoryName
    }
}

class InvalidScoringTotalError extends Error {
    total
    name
    constructor(name, total) {
        super(`The provided scoring policy ${name} has a total greater then 100: ${total}`)
        this.total = total
        this.name = name
    }
}

class NameTakenError extends Error {
    name
    entityType
    constructor(name, entityType) {
        super(`${name} is already being used for this ${entityType}`)
    }
}

class UserAlreadyHasAccessLevelError extends Error {
    constructor(userId) {
        this.userId = userId
    }
}

module.exports = { InvalidPerformanceCategoryNameError, InvalidScoringTotalError, NameTakenError, UserAlreadyHasAccessLevelError }