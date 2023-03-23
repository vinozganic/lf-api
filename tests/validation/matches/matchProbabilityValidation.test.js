const validateMatchProbability = require("../../../src/validation/matches/matchProbabilityValidation")

describe("validateMatchProbability", () => {
    test("returns an error for empty match probability", () => {
        const result = validateMatchProbability()
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability.")
    })

    test("returns an error for invalid match probability format", () => {
        const result = validateMatchProbability("not a number")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be a number.")
    })

    test("returns an error for invalid match probability", () => {
        const result = validateMatchProbability(1.5)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be between 0 and 1 (inclusive).")
    })

    test("returns an error for invalid match probability", () => {
        const result = validateMatchProbability(-1)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be between 0 and 1 (inclusive).")
    })

    test("returns success for valid match probability", () => {
        const result = validateMatchProbability(0.5)
        expect(result.success).toBe(true)
    })
})
