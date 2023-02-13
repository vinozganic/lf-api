const identifiableValidation = (body) => {
    const { identifiable } = body
    if (!identifiable) {
        return {
            sucess: false,
            error: {
                message: "Invalid identifiable",
                invalidIdentifiable: body.identifiable,
                validIdentifiable: true,
            },
        }
    }
    return { success: true }
}

module.exports = identifiableValidation