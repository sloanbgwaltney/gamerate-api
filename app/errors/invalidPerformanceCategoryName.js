class InvalidPerformanceCategoryName extends Error {
    categoryName
    constructor(categoryName) {
        super(`A invalid performance name: ${categoryName} was provided`)
        this.categoryName = categoryName
    }
}

module.exports = { InvalidPerformanceCategoryName }