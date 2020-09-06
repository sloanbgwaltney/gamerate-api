const { sign, verify } = require('jsonwebtoken')

const PRIVATE_SL_JWT_KEY = process.env.JWT_SL_PRIVATE_KEY
const PRIVATE_REFRESH_JWT_KEY = process.env.JWT_REFRESH_PRIVATE_KEY
const REFRESH_JWT_EXPIRES_IN = process.env.REFRESH_JWT_EXPIRES_IN
const SL_JWT_EXPIRES_IN = process.env.JWT_SL_EXPIRES_IN

async function createJWT(userId, key, claims) {
    return new Promise((res, rej) => {
        sign({ userId }, key, claims, (error, token) => {
            if (error) return rej(error)
            return res(token)
        })
    })
}

async function verifyJWTAndGetId(token, key) {
    return new Promise((res, rej) => {
        verify(token, key, (error, data) => {
            if (error) return rej(error)
            return res(data.userId)
        })
    })
}

async function createSLJWT(userId) {
    return createJWT(userId, PRIVATE_SL_JWT_KEY, { expiresIn: SL_JWT_EXPIRES_IN })
}

async function createRefreshJWT(userId) {
    return createJWT(userId, PRIVATE_REFRESH_JWT_KEY, { expiresIn: REFRESH_JWT_EXPIRES_IN })
}

async function getIdFromSLJWT(token) {
    return verifyJWTAndGetId(token, PRIVATE_SL_JWT_KEY)
}

async function getIdFromRefreshToken(token) {
    return verifyJWTAndGetId(token, PRIVATE_REFRESH_JWT_KEY)
}

module.exports = { createSLJWT, createRefreshJWT, getIdFromSLJWT, getIdFromRefreshToken }