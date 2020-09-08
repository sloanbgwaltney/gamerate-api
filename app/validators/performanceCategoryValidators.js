const joi = require('joi')

const createPerformanceCategorySchema = joi.object({
    name: joi.string().min(3).max(64).required(),
    minScore: joi.number().required(),
    maxScore: joi.number().required()
})

module.exports = { createPerformanceCategorySchema }