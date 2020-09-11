class NameTaken extends Error {
    name
    entityType
    constructor(name, entityType) {
        super(`${name} is already being used for this ${entityType}`)
    }
}

module.exports = { NameTaken }