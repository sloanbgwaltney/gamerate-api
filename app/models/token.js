const { Schema, model } = require('mongoose')

const tokenSchema = new Schema({
    token: String,
    blacklisted: Boolean,
    monitored: Boolean
})

const Token = model('token', tokenSchema)

module.exports = { Token }