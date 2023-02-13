const locationValidation = (body) => {
    const { location } = body
    const validLocationTypes = ["exact", "nonExact"]
    let error = undefined

    if (!validLocationTypes.includes(location.type)) {
        error = {
            message: "Invalid location type",
            validLocationTypes,
        }
    }

    if (location.type === "exact") {
        if (!location.coordinates) {
            error = {
                message: "Missing coordinates",
            }
        }

        if (!location.coordinates.latitude || !location.coordinates.longitude) {
            error = {
                message: "Missing coordinates",
            }
        }

        if (typeof location.coordinates.latitude !== "number" || typeof location.coordinates.longitude !== "number") {
            error = {
                message: "Invalid coordinates. Latitude and longitute must be a number",
            }
        }

        if (location.coordinates.latitude < -90 || location.coordinates.latitude > 90) {
            error = {
                message: "Invalid latitude",
                invalidLatitude: location.coordinates.latitude,
                validLatitude: [-90, 90],
            }
        }

        if (location.coordinates.longitude < -180 || location.coordinates.longitude > 180) {
            error = {
                message: error.invalidLatitude ? "Invalid longitude and latitude" : "Invalid longitude",
                invalidLongitude: location.coordinates.longitude,
                validLongitude: [-180, 180],
            }
        }

        return error ? { success: false, error } : { success: true }
    }

    if (location.type === "nonExact") {
        // for the following format, the coordinatesArray must be an array of arrays of arrays of two numbers,
        // where the first number is the latitude and the second number is the longitude
        /*
        location: {
            type: "nonExact",
            coordinatesArray: [
                [{longitude: startLong, latitude: startLat}, {longitude: endLong, latitude: endLat}],
                [{longitude: startLong, latitude: startLat}, {longitude: endLong, latitude: endLat}],
            ]
        }
        */

        if (!location.coordinatesArray) {
            error = {
                message: "Missing coordinatesArray",
            }
        }

        if (!Array.isArray(location.coordinatesArray)) {
            error = {
                message: "Invalid coordinatesArray. Must be an array",
            }
        }

        if (location.coordinatesArray.length === 0) {
            error = {
                message: "Invalid coordinatesArray. Must not be empty",
            }
        }

        coordinatesArray = location.coordinatesArray

        coordinatesArray.forEach((coordinates) => {
            if (!Array.isArray(coordinates)) {
                error = {
                    message: "Invalid coordinates. Must be an array",
                }
            }

            if (coordinates.length !== 2) {
                error = {
                    message: "Invalid coordinates. Must be an array of two elements",
                }
            }

            coordinates.forEach((coordinate) => {
                if (error) return
                if (typeof coordinate.latitude !== "number" || typeof coordinate.longitude !== "number") {
                    error = {
                        message: "Invalid coordinates. Latitude and longitute must be a number",
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

const req = {
    body: {
        location: {
            type: "nonExact",
            coordinatesArray: [
                [
                    { longitude: -12.53, latitude: 56.23 },
                    { longitude: 34.67, latitude: -90.34 },
                ],
                [
                    { longitude: 99.123, latitude: 12.34 },
                    { longitude: -78.56, latitude: -65.43 },
                ],
                [
                    { longitude: 45.67, latitude: 89.01 },
                    { longitude: -23.45, latitude: -67.89 },
                ],
                [
                    { longitude: 12.67, latitude: 56.78 },
                    { longitude: -67.89, latitude: 23.45 },
                ],
                [
                    { longitude: 67.89, latitude: 45.67 },
                    { longitude: -12.34, latitude: -56.78 },
                ],
            ],
        },
    },
}

const res = locationValidation(req.body)
console.log(res)
