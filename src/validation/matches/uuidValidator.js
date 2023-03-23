const validateUuid = (uuid) => {
    if (uuid == null) {
        return {
            success: false,
            error: {
                message: "Invalid uuid."
            }
        }
    }
    if (typeof uuid !== "string") {
        return {
            success: false,
            error: {
                message: "Invalid uuid. Must be a string."
            }
        }
    }
    const regex = /^[a-f\d]{4}-?[a-f\d]{4}-?[a-f\d]{4}-?[a-f\d]{4}-?[a-f\d]{4}-?[a-f\d]{4}-?[a-f\d]{4}-?[a-f\d]{4}$/i;
    const match = uuid.match(regex);
    if (!match) {
        return {
            success: false,
            error: {
                message: "Invalid uuid."
            }
        }
    }
    return { success: true }
}

module.exports = validateUuid