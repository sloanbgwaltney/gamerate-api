const createError = require('http-errors')

function validateBody(joiSchema) {
    return async function (req, res, next) {
        try {
            await joiSchema.validateAsync(req.body)
            next()
        } catch (e) {
            next(createError(422, { message: e.message }))
        }
    }
}

module.exports = { validateBody }