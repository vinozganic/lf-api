const validateType = require("../../src/validation/items/typeValidation")

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

    test("returns an error for invalid subtype", () => {
        const result = validateType({ type: "tech" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid subtype.")
    })

    test("returns an error for invalid subtype", () => {
        const result = validateType({ type: "tech", subtype: "not a subtype" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid subtype.")
    })

    test("returns an error for invalid subtype", () => {
        const result = validateType({ type: "tech", subtype: "shirt" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid subtype.")
    })

    test("returns success for valid subtype", () => {
        const result = validateType({ type: "tech", subtype: "laptop" })
        expect(result.success).toBe(true)
    })
})
