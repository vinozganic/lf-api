const validateId = require('../validateId')

const validateResolvedId = (body) => {
    const lostIdValidationResult = validateId(body.lostId)
    if (!lostIdValidationResult.success) {
        return lostIdValidationResult
    }
    if ('foundId' in Object.keys(body)) {
        const foundIdValidationResult = validateId(body.foundId)
        if (!foundIdValidationResult.success) {
            return foundIdValidationResult
        }
    }
    return { success: true }
}

module.exports = validateResolvedId