const typeValidation = (body) => {
    const { type } = body
    const validTypes = ["clothes", "misc", "tech"]
    if (!validTypes.includes(type)) {
        return {
            error: {
                message: "Invalid type",
                invalidType: type,
                validTypes,
            },
        }
    }
    return {}
}

module.exports = typeValidation
