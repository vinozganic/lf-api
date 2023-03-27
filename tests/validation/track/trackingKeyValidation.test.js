const trackingKeyValidation = require("../../../src/validation/track/trackingKeyValidation")

describe("trackingKeyValidation", () => {
    test("returns an error for empty tracking key", () => {
        const result = trackingKeyValidation()
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid tracking key.")
    })

    test("returns an error for invalid tracking key format", () => {
        const result = trackingKeyValidation(123)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid tracking key. Tracking key must be a string.")
    })

    test("returns an error when tracking key does not match the regex", () => {
        const result = trackingKeyValidation("A")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid tracking key.")
    })

    test("returns an error when tracking key does not match the regex", () => {
        const result = trackingKeyValidation("A12345678")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid tracking key.")
    })

    test("returns an error when tracking key does not match the regex", () => {
        const result = trackingKeyValidation("a1234567")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid tracking key.")
    })

    test("returns an error when tracking key does not match the regex", () => {
        const result = trackingKeyValidation("A123456.")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid tracking key.")
    })

    test("returns success for valid tracking key", () => {
        const result = trackingKeyValidation("A1234567")
        expect(result.success).toBe(true)
    })
})
