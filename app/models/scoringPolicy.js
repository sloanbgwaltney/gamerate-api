const { Schema } = require('mongoose')

const scoringPolicySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    weights: {
        type: Map,
        of: Number
    }
})

module.exports = { scoringPolicySchema }