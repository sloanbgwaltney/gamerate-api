const joi = require('joi')

const createGameProfileSchema = joi.object({
    name: joi.string().min(4).max(64)
})

module.exports = { createGameProfileSchema }