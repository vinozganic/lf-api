const validateId = require("./idValidator")

const validateIdList = (idList) => {
    if (!Array.isArray(idList)) {
        return {
            success: false,
            error: {
                message: "Id list must be an array.",
            },
        }
    }
    for (const id of idList) {
        const result = validateId(id)
        if (result.success === false) {
            return {
                success: false,
                error: {
                    message: result.error.message,
                },
            }
        }
    }
    return { success: true }
}

module.exports = validateIdList
