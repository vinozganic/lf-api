const trackingKeyValidation = (trackingKey) => {
    if (trackingKey == null) {
        return {
            success: false,
            error: {
                message: "Invalid tracking key."
            }
        }
    }
    if (typeof trackingKey !== "string") {
        return {
            success: false,
            error: {
                message: "Invalid tracking key. Tracking key must be a string."
            }
        }
    }
    const regex = /^[A-Z\d]{8}$/
    const match = trackingKey.match(regex)
    if (!match) {
        return {
            success: false,
            error: {
                message: "Invalid tracking key."
            }
        }
    }
    return { success: true }
}

module.exports = trackingKeyValidation