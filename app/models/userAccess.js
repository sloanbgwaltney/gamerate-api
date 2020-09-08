const { Schema } = require('mongoose')

const userAccessSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    accessLevel: Number,
    addedDate: Date,
    addeddBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    lastUpdatedDate: Date,
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = { userAccessSchema }