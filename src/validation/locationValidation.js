const locationValidation = (body) => {
    const { location } = body
    const validLocationTypes = ["exact", "nonExact"]
    let error = undefined

    if (!location) {
        return { success: false, error: { message: "Missing location" } }
    }

    if (!location.type) {
        return { success: false, error: { message: "Missing location type" } }
    }

    if (!validLocationTypes.includes(location.type)) {
        return {
            success: false,
            error: {
                message: "Invalid location type",
                validLocationTypes,
            },
        }
    }

    if (location.type === "exact") {
        if (!location.coordinates) {
            return {
                success: false,
                error: {
                    message: "Missing coordinates",
                },
            }
        }

        if (!location.coordinates.latitude || !location.coordinates.longitude) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates",
                },
            }
        }

        if (typeof location.coordinates.latitude !== "number" || typeof location.coordinates.longitude !== "number") {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates. Latitude and longitude must be a number",
                },
            }
        }

        if (location.coordinates.latitude < -90 || location.coordinates.latitude > 90) {
            return {
                success: false,
                error: {
                    message: "Invalid latitude",
                    invalidLatitude: location.coordinates.latitude,
                    validLatitude: [-90, 90],
                },
            }
        }

        if (location.coordinates.longitude < -180 || location.coordinates.longitude > 180) {
            return {
                success: false,
                error: {
                    message: error?.invalidLatitude ? "Invalid longitude and latitude" : "Invalid longitude",
                    invalidLongitude: location.coordinates.longitude,
                    validLongitude: [-180, 180],
                },
            }
        }

        return error ? { success: false, error } : { success: true }
    }

    if (location.type === "nonExact") {
        if (!location.publicTransportLines && !location.coordinatesArray) {
            return {
                success: false,
                error: {
                    message: "Missing coordinatesArray and publicTransportLines",
                },
            }
        }

        if (!location.publicTransportLines) {
            return {
                success: false,
                error: {
                    message: "Missing publicTransportLines",
                },
            }
        }

        if (!location.coordinatesArray) {
            return {
                success: false,
                error: {
                    message: "Missing coordinatesArray",
                },
            }
        }

        if (!Array.isArray(location.publicTransportLines)) {
            return {
                success: false,
                error: {
                    message: "Invalid publicTransportLines. Must be an array",
                },
            }
        }

        if (!Array.isArray(location.coordinatesArray)) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinatesArray. Must be an array",
                },
            }
        }

        const validPublicTransportLines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17]
        location.publicTransportLines.forEach((publicTransportLine) => {
            if (!validPublicTransportLines.includes(publicTransportLine)) {
                error = {
                    message: "Invalid publicTransportLines. Line does not exist",
                    invalidPublicTransportLine: publicTransportLine,
                    validPublicTransportLines,
                }
            }
        })
        if (error) return { success: false, error }

        let coordinatesArray = location.coordinatesArray

        coordinatesArray.forEach((coordinates) => {
            if (!Array.isArray(coordinates)) {
                error = {
                    message: "Invalid coordinates. Must be an array",
                }
            }
        })
        if (error) return { success: false, error }

        coordinatesArray.forEach((coordinates) => {
            if (coordinates.length !== 2) {
                error = {
                    message: "Invalid coordinates. Must be an array of two elements",
                }
            }
        })
        if (error) return { success: false, error }

        coordinatesArray.forEach((coordinates) => {
            coordinates.forEach((coordinate) => {
                if (error) return
                if (typeof coordinate.latitude !== "number" || typeof coordinate.longitude !== "number") {
                    error = {
                        message: "Invalid coordinates. Latitude and longitude must be a number",
                    }
                }

                if (coordinate.latitude < -90 || coordinate.latitude > 90) {
                    error = {
                        message: `Invalid latitude at coordinatesArray[${coordinatesArray.indexOf(coordinates)}][${coordinates.indexOf(
                            coordinate
                        )}]`,
                        invalidLatitude: coordinate.latitude,
                        validLatitude: [-90, 90],
                    }
                }

                if (coordinate.longitude < -180 || coordinate.longitude > 180) {
                    console.log()
                    latitudeErrorMessage = error
                        ? `Invalid latitude at coordinatesArray[${coordinatesArray.indexOf(coordinates)}][${coordinates.indexOf(
                              coordinate
                          )}]`
                        : undefined
                    longitudeErrorMessage = `Invalid longitude at coordinatesArray[${coordinatesArray.indexOf(
                        coordinates
                    )}][${coordinates.indexOf(coordinate)}]`
                    error = {
                        message: latitudeErrorMessage ? `${latitudeErrorMessage}. ${longitudeErrorMessage}` : longitudeErrorMessage,
                        invalidLongitude: coordinate.longitude,
                        validLongitude: [-180, 180],
                    }
                }
            })
        })
        return error ? { success: false, error } : { success: true }
    }
}

module.exports = locationValidation
