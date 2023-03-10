const validateId = require("./idValidation")
const validateMatchProbability = require("./matchProbabilityValidation")

const validateInsertMatch = (body) => {
    const foundIdCheck = validateId(body.foundId)
    const lostIdCheck = validateId(body.lostId)
    const matchProbabilityCheck = validateMatchProbability(body.matchProbability)

    const error = [foundIdCheck, lostIdCheck, matchProbabilityCheck]
        .filter((check) => check.success === false)
        .map((check) => check.error.message)
        [0]

    if (error) {
        return {
            success: false,
            error
        }
    }
    return { success: true }
}

module.exports = validateInsertMatch