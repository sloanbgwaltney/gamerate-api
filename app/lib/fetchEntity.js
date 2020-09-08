const createError = require('http-errors')

function fetchEntity(model, idKey, requestKeyToPopulate, opts = {}) {
    const defaultOpts = {
        errorOnNull: true
    }

    const finalOpts = Object.assign(defaultOpts, opts)

    return async function (req, res, next) {
        try {
            const entity = await model.findById(req.params[idKey])
            if (!entity && finalOpts.errorOnNull) return next(createError(422, `Invalid ID provided: ${req.params[idKey]}`))
            req[requestKeyToPopulate] = entity
            next()
        } catch (e) {
            console.log(e)
            next(createError(500))
        }
    }
}

module.exports = { fetchEntity }