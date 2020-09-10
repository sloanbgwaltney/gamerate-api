const createError = require('http-errors')

function fetchEntity(model, method, argumentsRetriever, propertySetter) {

    return async function (req, res, next) {
        try {
            const arguments = await argumentsRetriever(req, res)
            const entity = model[method](arguments)
            await propertySetter(req, res, entity)
            next()
        } catch (e) {
            console.log(e)
            next(createError(500))
        }
    }
}

module.exports = { fetchEntity }