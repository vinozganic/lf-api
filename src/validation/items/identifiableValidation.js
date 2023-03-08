const identifiableValidation = (body) => {
    const { identifiable } = body

    if (typeof identifiable !== "boolean") {
        return {
            success: false,
            error: {
                message: "Invalid identifiable",
                invalidIdentifiable: body.identifiable,
                validIdentifiable: [true, false],
            },
        }
    }

    return { success: true }
}

module.exports = identifiableValidation
