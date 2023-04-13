const validateId = require("./idValidation")
const validateMatchProbability = require("./matchProbabilityValidation")

const validateInsertMatch = (body) => {
    const foundIdCheck = validateId(body.foundId)
    const lostIdCheck = validateId(body.lostId)
    const matchProbabilityCheck = validateMatchProbability(body.matchProbability)

    const errors = [foundIdCheck, lostIdCheck, matchProbabilityCheck]
        .filter((check) => check.success === false)
        .map((check) => check.error.message)

    if (errors.length > 0) {
        return {
            success: false,
            error: {
                message: `${errors[0]}`,
            },
        }
    }
    return { success: true }
}

module.exports = validateInsertMatch
