const validateType = require("../../../src/validation/items/typeValidation")

describe("validateType", () => {
    test("returns an error for empty type", () => {
        const result = validateType({})
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid type.")
    })

    test("returns an error for invalid type", () => {
        const result = validateType({ type: "not a type" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid type.")
    })
})
