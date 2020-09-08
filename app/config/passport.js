const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const createError = require('http-errors')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_PRIVATE_KEY;

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOneByUsername(username)
            if (!user) return done(createError(400, 'Invalid Username or password'), false)
            if (!await user.validPassword(password)) return done(createError(400, 'Invalid username or password'), false);
            return done(null, user);
        } catch (e) {
            return done(e)
        }
    }
))

passport.use(new JwtStrategy(opts, async function (payload, done) {
    try {
        const user = await User.findById(payload.userId)
        if (!user) return done(createError(403, 'Invalid or expired token'), false)
        return done(null, user)
    } catch (e) {
        done(e)
    }
}))

module.exports = { passport }