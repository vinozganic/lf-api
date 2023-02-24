const { beforeAll } = require("@jest/globals")
const validateType = require("../../src/validation/typeValidation")
const validateColor = require("../../src/validation/colorValidation")
const validateLocation = require("../../src/validation/locationValidation")
const validateTime = require("../../src/validation/timeValidation")
const validateIdentifiable = require("../../src/validation/identifiableValidation")


describe("validateType", () => {
    test("returns an error for empty type", () => {
        const result = validateType({})
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid type")
    })
    test("returns an error for invalid type", () => {
        const result = validateType({ type: "not a type" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid type")
    })

    test("returns an error for invalid subtype", () => {
        const result = validateType({ type: "tech" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid subtype")
    })

    test("returns an error for invalid subtype", () => {
        const result = validateType({ type: "tech", subtype: "not a subtype" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid subtype")
    })

    test("returns an error for invalid subtype", () => {
        const result = validateType({ type: "tech", subtype: "shirt" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid subtype")
    })

    test("returns success for valid subtype", () => {
        const result = validateType({ type: "tech", subtype: "laptop" })
        expect(result.success).toBe(true)
    })
})

describe("validateColor", () => {
    test("returns an error for invalid color format", () => {
        const result = validateColor({ color: "not an array" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid color format. Color must be an array of 3 numbers")
    })

    test("returns an error for invalid color values", () => {
        const result = validateColor({ color: [256, -1, 200] })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid color")
    })

    test("returns success for valid color", () => {
        const result = validateColor({ color: [100, 200, 50] })
        expect(result.success).toBe(true)
    })
})

describe("validateLocation", () => {
    test("returns an error for empty location", () => {
        const result = validateLocation({})
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing location")
    })

    test("returns an error for empty location", () => {
        const result = validateLocation({ location: "not an object" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing location type")
    })

    test("returns an error for invalid location type", () => {
        const result = validateLocation({ location: { type: "not a type" } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid location type")
    })

    test("returns an error for empty coordinates in exact location", () => {
        const result = validateLocation({ location: { type: "exact", coordinates: {} } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates")
    })

    test("returns an error for missing latitude or longitude coordinates in exact location", () => {
        const result = validateLocation({ location: { type: "exact", coordinates: { longitude: 80 } } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates")
    })

    test("returns an error for coordinates that are not numbers in exact location", () => {
        const result = validateLocation({ location: { type: "exact", coordinates: { latitude: 80, longitude: "not a number" } } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates. Latitude and longitude must be a number")
    })

    test("returns an error for latitude not being within the valid range in exact location", () => {
        const result = validateLocation({ location: { type: "exact", coordinates: { latitude: 100, longitude: 100 } } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid latitude")
    })

    test("returns an error for longitude not being within the valid range in exact location", () => {
        const result = validateLocation({ location: { type: "exact", coordinates: { latitude: 80, longitude: 200 } } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid longitude")
    })

    test("returns an error if there is neither coordinatesArray nor publicTransportLines in non exact location", () => {
        const result = validateLocation({ location: { type: "nonExact" } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing coordinatesArray and publicTransportLines")
    })

    test("returns an error for empty public transport lines in non exact location", () => {
        const result = validateLocation({ location: { type: "nonExact", coordinatesArray: [] } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing publicTransportLines")
    })

    test("returns error for missing coordinatesArray", () => {
        const result = validateLocation({ location: { type: "nonExact", publicTransportLines: [2] } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing coordinatesArray")
    })

    test("returns an error for public transport lines that are not an array in non exact location", () => {
        const result = validateLocation({ location: { type: "nonExact", publicTransportLines: "not an array", coordinatesArray: [] } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid publicTransportLines. Must be an array")
    })

    test("returns an error for non valid public transport lines in non exact location", () => {
        const result = validateLocation({ location: { type: "nonExact", publicTransportLines: [-23, 12], coordinatesArray: [] } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid publicTransportLines. Line does not exist")
    })

    test("returns an error for coordinates that are not an array in non exact location", () => {
        const result = validateLocation({ location: { type: "nonExact", coordinatesArray: "not an array", publicTransportLines: [] } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinatesArray. Must be an array")
    })

    test("returns an error for coordinates that are not an array in coordinatesArray in non exact location", () => {
        const result = validateLocation({ location: { type: "nonExact", coordinatesArray: [23, 12], publicTransportLines: [] } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates. Must be an array")
    })

    test("returns an error for coordinates that are not an array of 2 elements in coordinatesArray in non exact location", () => {
        const result = validateLocation({ location: { type: "nonExact", coordinatesArray: [[23, 12, 12]], publicTransportLines: [] } })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates. Must be an array of two elements")
    })

    test("returns an error for coordinates that are not numbers in coordinatesArray in non exact location", () => {
        const result = validateLocation({
            location: {
                type: "nonExact",
                coordinatesArray: [
                    [
                        { longitude: "rg", latitude: "not a number" },
                        { longitude: 23, latitude: 23 },
                    ],
                ],
                publicTransportLines: [],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid coordinates. Latitude and longitude must be a number")
    })

    test("returns an error for latitude not being within the valid range in coordinatesArray in non exact location", () => {
        const result = validateLocation({
            location: {
                type: "nonExact",
                coordinatesArray: [
                    [
                        { longitude: 100, latitude: 100 },
                        { longitude: 23, latituede: 23 },
                    ],
                ],
                publicTransportLines: [],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid latitude at coordinatesArray[0][0]")
    })

    test("returns an error for longitude not being within the valid range in coordinatesArray in non exact location", () => {
        const result = validateLocation({
            location: {
                type: "nonExact",
                coordinatesArray: [
                    [
                        { longitude: 80, latitude: 80 },
                        { longitude: 200, latitude: 23 },
                    ],
                ],
                publicTransportLines: [],
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid longitude at coordinatesArray[0][1]")
    })

    test("returns success for valid coordinatesArray in non exact location", () => {
        const result = validateLocation({
            location: {
                type: "nonExact",
                coordinatesArray: [
                    [
                        { longitude: 80, latitude: 80 },
                        { longitude: 23, latitude: 23 },
                    ],
                ],
                publicTransportLines: [],
            },
        })
        expect(result.success).toBe(true)
    })
})