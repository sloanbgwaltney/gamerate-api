function initializeRequest() {
    return function (req, res, next) {
        req.entities = {}
        next()
    }
}

module.exports = { initializeRequest }