const validateId = require("./idValidation")
const validateMatchProbability = require("./matchProbabilityValidation")

const validateOnlyId = (id) => {
    const validationResult = validateId(id)
    if (!validationResult.success) {
        return validationResult
    }
    return { success: true }
}

const validateIdsAndMatchProbability = (foundId, lostId, matchProbability) => {
    const validationResultOfFoundId = validateId(foundId)
    const validationResultOfLostId = validateId(lostId)
    const validationResultOfMatchProbability = validateMatchProbability(matchProbability)

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

const validate = (functionName, body) => {
    if (functionName === "getMatchesByFoundId" || functionName === "getMatchesByLostId") {
        return validateOnlyId(body.id)
    } else if (functionName === "insertMatch") {
        return validateIdsAndMatchProbability(body.foundId, body.lostId, body.matchProbability)
    } else {
        return {
            success: false,
            error: {
                message: "Invalid function name."
            }
        }
    }
}

module.exports = validate