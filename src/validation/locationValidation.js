const locationValidation = (body) => {
    const { location } = body
    const validPublicTransportLines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    if (location.type === "Point") {
        if (location.coordinates.length !== 2) {
            return { success: false, error: "Invalid coordinates" }
        }

        for (let i = 0; i < location.coordinates.length; i++) {
            if (typeof location.coordinates[i] !== "number") {
                return { success: false, error: "Invalid coordinates" }
            }
        }

        if (location.coordinates[0] < -180 || location.coordinates[0] > 180) {
            return { success: false, error: "Invalid coordinates" }
        }

        if (location.coordinates[1] < -90 || location.coordinates[1] > 90) {
            return { success: false, error: "Invalid coordinates" }
        }
    } else if (location.type === "MultiLineString") {
        if (location.coordinates.length < 2) {
            return { success: false, error: "Invalid coordinates" }
        }

        for (let i = 0; i < location.coordinates.length; i++) {
            if (location.coordinates[i].length !== 2) {
                return { success: false, error: "Invalid coordinates" }
            }

            if (typeof location.coordinates[i][0] !== "number" || typeof location.coordinates[i][1] !== "number") {
                return { success: false, error: "Invalid coordinates" }
            }

            if (location.coordinates[i][0] < -180 || location.coordinates[i][0] > 180) {
                return { success: false, error: "Invalid coordinates" }
            }

            if (location.coordinates[i][1] < -90 || location.coordinates[i][1] > 90) {
                return { success: false, error: "Invalid coordinates" }
            }
        }

        if (location.publicTransportLines) {
            if (!Array.isArray(location.publicTransportLines)) {
                return { success: false, error: "Invalid public transport lines" }
            }

            for (let i = 0; i < location.publicTransportLines.length; i++) {
                if (typeof location.publicTransportLines[i] !== "number") {
                    return { success: false, error: "Invalid public transport lines" }
                }

                if (!validPublicTransportLines.includes(location.publicTransportLines[i])) {
                    return { success: false, error: "Invalid public transport lines" }
                }
            }
        } else {
            return { success: false, error: "Invalid public transport lines" }
        }
    } else {
        return { success: false, error: "Invalid location type" }
    }

    return { success: true }
}

module.exports = locationValidation
