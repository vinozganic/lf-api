const locationValidation = (body) => {
    const { location } = body

    if (!location.path && !location.publicTransportLines) {
        return {
            success: false,
            error: {
                message: "Invalid location.",
            },
        }
    }

    if (location.path.type === "Point") {
        if (location.path.coordinates.length !== 2) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates.",
                },
            }
        }

        for (let i = 0; i < location.path.coordinates.length; i++) {
            if (typeof location.path.coordinates[i] !== "number") {
                return {
                    success: false,
                    error: {
                        message: "Invalid coordinates.",
                    },
                }
            }
        }

        if (location.path.coordinates[0] < -180 || location.path.coordinates[0] > 180) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates.",
                },
            }
        }

        if (location.path.coordinates[1] < -90 || location.path.coordinates[1] > 90) {
            return {
                success: false,
                error: {
                    message: "Invalid coordinates.",
                },
            }
        }
    } else if (location.path.type === "MultiLineString") {
        for (let i = 0; i < location.path.coordinates.length; i++) {
            if (location.path.coordinates[i].length < 2) {
                return {
                    success: false,
                    error: {
                        message: "Invalid coordinates.",
                    },
                }
            }

            for (let j = 0; j < location.path.coordinates[i].length; j++) {
                if (location.path.coordinates[i][j].length !== 2) {
                    return {
                        success: false,
                        error: {
                            message: "Invalid coordinates.",
                        },
                    }
                }

                if (typeof location.path.coordinates[i][j][0] !== "number" || typeof location.path.coordinates[i][j][1] !== "number") {
                    return {
                        success: false,
                        error: {
                            message: "Invalid coordinates.",
                        },
                    }
                }

                if (location.path.coordinates[i][j][0] < -180 || location.path.coordinates[i][j][0] > 180) {
                    return {
                        success: false,
                        error: {
                            message: "Invalid coordinates.",
                        },
                    }
                }

                if (location.path.coordinates[i][j][1] < -90 || location.path.coordinates[i][j][1] > 90) {
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
