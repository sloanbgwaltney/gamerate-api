const { User } = require('../models/user')
const createError = require('http-errors')

function login() {
    return async function (req, res, next) {
        try {
            const requestor = await User.findOneByUsername(req.body.username)
            if (!requestor) return next(createError(400, 'Invalid Username or Password'))
            if (! await requestor.validPassword(req.body.password)) return next(createError(400, 'Invalid Username or Password'))
            // do jwt magic
        } catch (e) {
            console.log(e)
            next(createError(500))
        }
    }
}

module.exports = { login }