const createError = require('http-errors')
const { createJWT } = require('../lib/token')

function login() {
    return async function (req, res, next) {
        try {
            const accessToken = await createJWT(req.user.id)
            res.status(200).json({ accessToken })
        } catch (e) {
            console.log(e)
            next(createError(500))
        }
    }
}

// function refresh() {
//     return async function (req, res, next) {
//         try {
//             if (!req.usedRefreshToken) return next(createError(400, 'Invalid refresh token'))
//             const accessToken = await createSLJWT(req.user.id)
//             res.status(200).json({ accessToken })
//         } catch (e) {
//             console.log(e)
//             if (e instanceof JsonWebTokenError) return next(createError(400, 'Invalid refresh token'))
//             if (e instanceof TokenExpiredError) return next(createError(440, 'Session has expired'))
//             return next(createError(500))
//         }
//     }
// }

module.exports = { login }