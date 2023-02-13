const typeValidation = (body) => {
    const { type } = body
    const validTypes = ["clothes", "misc", "tech"]
    if (!validTypes.includes(type)) {
        return {
            success: false,
            error: {
                message: "Invalid type",
                invalidType: type,
                validTypes,
            },
        }
    }
    return {
        success: true,
    }
}

module.exports = typeValidation
