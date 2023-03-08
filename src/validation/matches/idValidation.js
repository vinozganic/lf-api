const validateId = (id) => {
    if (typeof id !== "number") {
        return {
            success: false,
            error: {
                message: "Invalid id. Id must be a number."
            }
        }
    }
    if (!Number.isInteger(id)) {
        return {
            success: false,
            error: {
                message: "Invalid id. Id must be an integer."
            }
        }
    }
    if (id < 0) {
        return {
            success: false,
            error: {
                message: "Invalid id. Id must be a positive integer."
            }
        }
    }
    return { success: true }
}

module.exports = validateId
