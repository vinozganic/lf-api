const validateLocation = require("../../../src/validation/items/locationValidation")

// nakon kaj zavrsis promjeni result.error u result.error.message

describe("validateLocation", () => {
    test("returns an error for invalid location", () => {
        const result = validateLocation({
            location: {},
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid location.")
    })

    test("returns an error for invalid location type", () => {
        const result = validateLocation({
            location: {
                type: "not a valid type",
                coordinates: [176, 75],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid location type.")
    })

    test("returns an error for invalid Points coordinates length", () => {
        const result = validateLocation({
            location: {
                type: "Point",
                coordinates: [1],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error for invalid type of Points coordinates", () => {
        const result = validateLocation({
            location: {
                type: "Point",
                coordinates: ["a", "b"],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error when Points coordinates are out of range (longitude)", () => {
        const result = validateLocation({
            location: {
                type: "Point",
                coordinates: [181, 75],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error when Points coordinates are out of range (latitude)", () => {
        const result = validateLocation({
            location: {
                type: "Point",
                coordinates: [15, 91],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error when Points coordinates are out of range (both)", () => {
        const result = validateLocation({
            location: {
                type: "Point",
                coordinates: [181, 91],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error for invalid MultiLineString coordinates length", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [[[179, 75]]],
                publicTransportLines: [1, 2, 3],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error for invalid type of MultiLineString coordinates", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [1, "a"],
                        [2, "b"],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error when MultiLineString coordinates are out of range (longitude)", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [169, 75],
                    ],
                    [
                        [179, 75],
                        [181, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error when MultiLineString coordinates are out of range (latitude)", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 57],
                    ],
                    [
                        [179, 75],
                        [179, 91],
                    ],
                    [
                        [179, 75],
                        [-100, -20],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error when MultiLineString coordinates are out of range (both)", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [-164, 23],
                    ],
                    [
                        [179, 75],
                        [-120, -50],
                    ],
                    [
                        [179, 75],
                        [190, -99],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error if LineString coordinates are invalid", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [1, 2, 3],
                        [2, 2],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates.")
    })

    test("returns an error if publicTransportLines don't exist in MultiLineString", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing public transport lines.")
    })

    test("returns an error if publicTransportLines are not an array", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: "not an array",
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid public transport lines.")
    })

    test("returns an error if publicTransportLines are not an array of numbers", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: ["not a number", 2, 3],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid public transport lines.")
    })

    test("returns success for valid Points location", () => {
        const result = validateLocation({
            location: {
                type: "Point",
                coordinates: [179, 75],
            },
        })
        expect(result.success).toBe(true)
    })

    test("returns success for valid MultiLineString location", () => {
        const result = validateLocation({
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
        })
        expect(result.success).toBe(true)
    })
})
