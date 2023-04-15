const validateId = require("./idValidator")
const validateMatchProbability = require("./matchProbabilityValidation")

const validateBatchInsertMatches = (body) => {
    if (!Array.isArray(body)) {
        return {
            success: false,
            error: {
                message: "Body must be an array",
            },
        }
    }

    for (const match of body) {
        const foundIdCheck = validateId(match.foundId)
        const lostIdCheck = validateId(match.lostId)
        const matchProbabilityCheck = validateMatchProbability(match.matchProbability)

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
    }
    return { success: true }
}

module.exports = validateBatchInsertMatches
