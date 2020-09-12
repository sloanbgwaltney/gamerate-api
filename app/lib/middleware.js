const createError = require('http-errors')

function fetchEntity(model, method, argumentsRetriever, propertySetter) {

    return async function (req, res, next) {
        try {
            const arguments = await argumentsRetriever(req, res)
            const entity = await model[method](arguments)
            await propertySetter(req, res, entity)
            next()
        } catch (e) {
            console.log(e)
            next(createError(500))
        }
    }
}

function initializeRequest() {
    return function (req, res, next) {
        req.entities = {}
        next()
    }
}


function isAuthorized(authorizerFunc, unauthorizedMessage) {
    return async function (req, res, next) {
        const result = authorizerFunc(req, res)
        if (result) return next()
        next(createError(401, unauthorizedMessage))
    }
}

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

module.exports = {
    fetchEntity,
    initializeRequest,
    isAuthorized,
    validateBody
}