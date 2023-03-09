const validateId = require("./idValidation")
const validateMatchProbability = require("./matchProbabilityValidation")

const validateInsertMatch = (body) => {
    const validationResultOfFoundId = validateId(body.foundId)
    const validationResultOfLostId = validateId(body.lostId)
    const validationResultOfMatchProbability = validateMatchProbability(body.matchProbability)

    const errors = [validationResultOfFoundId, validationResultOfLostId, validationResultOfMatchProbability]
        .filter((check) => check.success === false)
        .map((check) => check.error.message)

    if (errors.length > 0) {
        return {
            success: false,
            errors,
        }
    }
    return { success: true }
}

module.exports = validateInsertMatch