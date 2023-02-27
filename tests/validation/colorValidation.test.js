const validateColor = require("../../src/validation/colorValidation")

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