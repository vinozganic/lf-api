const locationValidation = (body) => {
    const { location } = body

    if (!location.type || !location.coordinates) {
        return {
            success: false,
            error: {
                message: "Invalid location.",
            },
        }
    }

    if (location.type === "Point") {
        if (location.coordinates.length !== 2) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates.",
                },
            }
        }

        for (let i = 0; i < location.coordinates.length; i++) {
            if (typeof location.coordinates[i] !== "number") {
                return {
                    success: false,
                    error: {
                        message: "Invalid coordinates.",
                    },
                }
            }
        }

        if (location.coordinates[0] < -180 || location.coordinates[0] > 180) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates.",
                },
            }
        }

        if (location.coordinates[1] < -90 || location.coordinates[1] > 90) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates.",
                },
            }
        }
    } else if (location.type === "MultiLineString") {
        for (let i = 0; i < location.coordinates.length; i++) {
            if (location.coordinates[i].length < 2) {
                return {
                    success: false,
                    error: {
                        message: "Invalid coordinates.",
                    },
                }
            }

            for (let j = 0; j < location.coordinates[i].length; j++) {
                if (location.coordinates[i][j].length !== 2) {
                    return {
                        success: false,
                        error: {
                            message: "Invalid coordinates.",
                        },
                    }
                }

                if (typeof location.coordinates[i][j][0] !== "number" || typeof location.coordinates[i][j][1] !== "number") {
                    return {
                        success: false,
                        error: {
                            message: "Invalid coordinates.",
                        },
                    }
                }

                if (location.coordinates[i][j][0] < -180 || location.coordinates[i][j][0] > 180) {
                    return {
                        success: false,
                        error: {
                            message: "Invalid coordinates.",
                        },
                    }
                }

                if (location.coordinates[i][j][1] < -90 || location.coordinates[i][j][1] > 90) {
                    return {
                        success: false,
                        error: {
                            message: "Invalid coordinates.",
                        },
                    }
                }
            }
        }

        if (location.publicTransportLines) {
            if (!Array.isArray(location.publicTransportLines)) {
                return {
                    success: false,
                    error: {
                        message: "Invalid public transport lines.",
                    },
                }
            }

            for (let i = 0; i < location.publicTransportLines.length; i++) {
                if (typeof location.publicTransportLines[i] !== "number") {
                    return {
                        success: false,
                        error: {
                            message: "Invalid public transport lines.",
                        },
                    }
                }
            }
        } else {
            return {
                success: false,
                error: {
                    message: "Missing public transport lines.",
                },
            }
        }
    } else {
        return {
            success: false,
            error: {
                message: "Invalid location type.",
            },
        }
    }

    return { success: true }
}

module.exports = locationValidation
