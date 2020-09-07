const { User } = require('../models/user')
const createError = require('http-errors')
const { createSLJWT, createRefreshJWT } = require('../lib/token')

function login() {
    return async function (req, res, next) {
        try {
            const requestor = await User.findOneByUsername(req.body.username)
            if (!requestor) return next(createError(400, 'Invalid Username or Password'))
            if (! await requestor.validPassword(req.body.password)) return next(createError(400, 'Invalid Username or Password'))
            const accessToken = await createSLJWT(requestor.id)
            const refreshToken = await createRefreshJWT(requestor.id)
            res.status(200).json({ accessToken, refreshToken })
        } catch (e) {
            console.log(e)
            next(createError(500))
        }
    }
}

function refresh() {
    return async function (req, res, next) {
        try {
            if (!req.usedRefreshToken) return next(createError(400, 'Invalid refresh token'))
            const accessToken = await createSLJWT(req.user.id)
            res.status(200).json({ accessToken })
        } catch (e) {
            console.log(e)
            if (e instanceof JsonWebTokenError) return next(createError(400, 'Invalid refresh token'))
            if (e instanceof TokenExpiredError) return next(createError(440, 'Session has expired'))
            return next(createError(500))
        }
    }
}

module.exports = { login, refresh }