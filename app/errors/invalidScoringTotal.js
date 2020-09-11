class InvalidScoringTotal extends Error {
    total
    name
    constructor(name, total) {
        super(`The provided scoring policy ${name} has a total greater then 100: ${total}`)
        this.total = total
        this.name = name
    }
}

module.exports = { InvalidScoringTotal }