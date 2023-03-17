const validateId = require("../../src/validation/matches/idValidation")

describe("validateId", () => {
    test("returns an error for empty id", () => {
        const result = validateId()
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns an error for invalid id format", () => {
        const result = validateId(false)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a string.")
    })

    test("returns an error when id does not match the regex", () => {
        const result = validateId("45cbc4a0e4123f6920000002f")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns an error when id does not match the regex", () => {
        const result = validateId("45cbc4a0e4123f692000000")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns an error when id does not match the regex", () => {
        const result = validateId("45cbc4a0e4123f692000000z")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns success for valid id", () => {
        const result = validateId("45cbc4a0e4123f6920000002")
        expect(result.success).toBe(true)
    })
})
