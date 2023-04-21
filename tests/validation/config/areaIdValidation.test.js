const validateAreaId = require("../../../src/validation/config/areaIdValidator")

describe("validateAreaId", () => {
    test("returns an error for invalid area id", () => {
        const result = validateAreaId("not a number")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Area id must be a number")
    })

    test("returns success for valid area id", () => {
        const result = validateAreaId(1)
        expect(result.success).toBe(true)
    })
})
