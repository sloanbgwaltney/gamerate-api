const { Schema } = require('mongoose')

function createUpdateMetadataPlugin(schema, options = {}) {
    const defaultOptions = {
        createdByField: 'createdBy',
        createdAtField: 'createdAt',
        lastUpdatedByField: 'lastUpdatedBy',
        lastUpdatedAtField: 'lastUpdatedAt',
        userModelRef: 'user'
    }
    const finalOptions = Object.assign(defaultOptions, options)

    const schemaToAdd = {
        [finalOptions.createdAtField]: Date,
        [finalOptions.createdByField]: {
            type: Schema.Types.ObjectId,
            ref: finalOptions.userModelRef
        },
        [finalOptions.lastUpdatedAtField]: Date,
        [finalOptions.lastUpdatedByField]: {
            type: Schema.Types.ObjectId,
            ref: finalOptions.userModelRef
        }
    }
    // add fields to top level schema 
    schema.add(schemaToAdd)

    // for each map/object path lets add this metadata we can always hide it from the response if desired
    schema.eachPath((path, type) => {
        addFieldsToMap(path, type)
    })

    schema.methods.setCreateEditMetadata = function (obj, userId, create = false, date = new Date()) {
        obj[finalOptions.lastUpdatedAtField] = date
        obj[finalOptions.lastUpdatedByField] = userId
        if (create) {
            obj[finalOptions.createdAtField] = date
            obj[finalOptions.createdByField] = userId
        }
        return obj
    }

    function addFieldsToMap(path, type) {
        if (type instanceof Schema.Types.Map) {
            // if "of" was defined with a schema we can just add to that schema
            if (type.options.of instanceof Schema) {
                type.options.of.add(schemaToAdd)
            } else if (typeof type.options.of === 'object' && typeof type.options.of != null) {
                type.options.of = Object.assign(type.options.of, schemaToAdd)
                schema.path(path, type)
            }
        }
    }
}

module.exports = { createUpdateMetadataPlugin }