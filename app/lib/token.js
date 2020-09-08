const { sign } = require('jsonwebtoken')

const PRIVATE_JWT_KEY = process.env.JWT_PRIVATE_KEY
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

async function _createJWT(userId, key, claims) {
    return new Promise((res, rej) => {
        sign({ userId }, key, claims, (error, token) => {
            if (error) return rej(error)
            return res(token)
        })
    })
}

async function createJWT(userId) {
    return _createJWT(userId, PRIVATE_JWT_KEY, { expiresIn: JWT_EXPIRES_IN })
}

module.exports = { createJWT }