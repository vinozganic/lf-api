const validateMatchProbability = (matchProbability) => {
    if (typeof matchProbability !== "number") {
        return {
            success: false,
            error: {
                message: "Invalid match probability. Match probability must be a number."
            }
        }
    }
    if (matchProbability < 0 || matchProbability > 1) {
        return {
            success: false,
            error: {
                message: "Invalid match probability. Match probability must be between 0 and 1 (inclusive)."
            }
        }
    }
    return { success: true }
}

module.exports = validateMatchProbability