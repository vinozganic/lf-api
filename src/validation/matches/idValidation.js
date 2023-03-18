const validateId = (id) => {
    if (id == null) {
        return {
            success: false,
            error: {
                message: "Invalid id."
            }
        }
    }
    if (typeof id !== "string") {
        return {
            success: false,
            error: {
                message: "Invalid id. Id must be a string."
            }
        }
    }
    const regex = /^[a-f\d]{24}$/i
    const match = id.match(regex)
    if (!match) {
        return {
            success: false,
            error: {
                message: "Invalid id."
            }
        }
    }
    return { success: true }
}

module.exports = validateId
