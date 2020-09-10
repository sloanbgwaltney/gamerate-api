const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const createError = require('http-errors')

const PASSPORT_KEYS = {
    LOCAL: 'local',
    JWT: 'jwt'
}

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

// Passport is mostly abput authentication the processes below where more authorization and easier/more flexable methods have been implemented
// passport.use('level-3-gameprofile-access', new CustomStrategy(passportGameProfileAccessSetup(3)))
// passport.use('level-2-gameprofile-access', new CustomStrategy(passportGameProfileAccessSetup(2)))
// passport.use('level-1-gameprofile-access', new CustomStrategy(passportGameProfileAccessSetup(1)))

// function passportGameProfileAccessSetup(level) {
//     return function (request, done) {
//         if (!request.user) throw new TypeError('User is required at this point')
//         if (!req.entities.gameProfile) throw new TypeError('GameProfile refernce is not in the request')
//         const userAccess = req.entities.gameProfile.getUserAccess(request.user.id)
//         console.log(userAccess)
//         if (!userAccess || userAccess.accessLevel < level) return done(createError(403, 'You do not have the permission required for this request'), null)
//         return done(null, request.user)
//     }
// }

module.exports = { passport, PASSPORT_KEYS }