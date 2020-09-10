const createError = require('http-errors')

function isAuthorized(authorizerFunc, unauthorizedMessage) {
    return async function (req, res, next) {
        const result = authorizerFunc(req, res)
        if (result) return next()
        next(createError(401, unauthorizedMessage))
    }
}

module.exports = { isAuthorized }