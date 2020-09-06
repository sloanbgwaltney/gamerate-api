const { getIdFromSLJWT } = require('./token')
const { User } = require('../models/user')
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')
const createError = require('http-errors')

function validateRequestor() {
    return async function (req, res, next) {
        try {
            const token = req.headers.authorization
            if (!token) return next()
            const userId = await getIdFromSLJWT(token)
            const user = await User.findById(userId)
            if (!user) next(createError(400, 'Invalid authorization token'))
            req.user = user
            next()
        } catch (e) {
            if (e instanceof JsonWebTokenError) return next(createError(400, 'Invalid authorization token'))
            if (e instanceof TokenExpiredError) return next(createError(440, 'Session has expired'))
        }
    }
}

module.exports = { validateRequestor }