const validateId = require("../../src/validation/matches/idValidation")

describe("validateId", () => {
    test("returns an error for invalid id format", () => {
        const result = validateId("not a number")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a number.")
    })

    test("returns an error for invalid id number type", () => {
        const result = validateId(1.5)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be an integer.")
    })

    test("returns an error for invalid id number value", () => {
        const result = validateId(-1)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a positive integer.")
    })

    test("returns success for valid id", () => {
        const result = validateId(1)
        expect(result.success).toBe(true)
    })
})
