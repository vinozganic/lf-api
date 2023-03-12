const validateDate = require("../../src/validation/items/dateValidation")

describe("validateDate", () => {
    test("returns an error for empty date", () => {
        const result = validateDate({
            date: {},
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid date.")
    })

    test("returns an error for invalid date (invalid month)", () => {
        const result = validateDate({
            date: "2021-67-01",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid date.")
    })

    test("returns an error for invalid date (invalid day)", () => {
        const result = validateDate({
            date: "2021-05-43",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid date.")
    })

    test("returns success for valid date", () => {
        const result = validateDate({
            date: "2021-01-01",
        })
        expect(result.success).toBe(true)
    })
})
