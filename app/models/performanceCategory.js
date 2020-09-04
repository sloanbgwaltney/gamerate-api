const { Schema } = require("mongoose");

const performanceCategory = new Schema({
    name: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdDate: Date,
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    minScore: Number,
    maxScore: Number
})

module.exports = { performanceCategory }