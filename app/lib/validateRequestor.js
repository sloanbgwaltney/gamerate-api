const { getIdFromSLJWT, getIdFromRefreshToken } = require('./token')
const { User } = require('../models/user')
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken')
const createError = require('http-errors')

function validateRequestor() {
    return async function (req, res, next) {
        try {
            const token = req.headers.authorization
            if (!token) return next()
            const userId = await getRequestorId(token, req)
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

// Wish this was a tad cleaner, however, their is not a simple way I know of to do if Promsie A or B resolves then resolve the wrapper
async function getRequestorId(token, req) {
    return new Promise((res, rej) => {
        getIdFromSLJWT(token)
            .then(id => {
                req.usedRefreshToken = false
                return res(id)
            })
            .catch(err => {
                if (err instanceof TokenExpiredError) return rej(err)
                getIdFromRefreshToken(token)
                    .then(id => {
                        req.usedRefreshToken = true
                        return res(id)
                    })
                    .catch(e => rej(e))
            })
    })
}

module.exports = { validateRequestor }