const validateInsertMatch = require("../../src/validation/matches/insertMatchValidator")

describe("validateInsertMatch", () => {
    test("returns an error for invalid foundId format", () => {
        const result = validateInsertMatch({ foundId: "not a number", lostId: 1, matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a number.")
    })

    test("returns an error for invalid foundId number type", () => {
        const result = validateInsertMatch({ foundId: 1.5, lostId: 1, matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be an integer.")
    })

    test("returns an error for invalid foundId format", () => {
        const result = validateInsertMatch({ foundId: "not a number", matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a number.")
    })

    test("returns an error for invalid lostId format", () => {
        const result = validateInsertMatch({ foundId: 1, lostId: "not a number", matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a number.")
    })

    test("returns an error for invalid lostId number type", () => {
        const result = validateInsertMatch({ foundId: 1, lostId: 1.5, matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be an integer.")
    })

    test("returns an error for invalid lostId number type", () => {
        const result = validateInsertMatch({ foundId: 1, lostId: 1.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be an integer.")
    })

    test("returns an error for invalid match probability format", () => {
        const result = validateInsertMatch({ foundId: 1, lostId: 1, matchProbability: "not a number" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be a number.")
    })

    test("returns an error for invalid match probability", () => {
        const result = validateInsertMatch({ foundId: 1, lostId: 1, matchProbability: 1.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be between 0 and 1 (inclusive).")
    })

    test("returns an error for invalid match probability", () => {
        const result = validateInsertMatch({ foundId: 1, lostId: 1, matchProbability: -1 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be between 0 and 1 (inclusive).")
    })

    test("returns success for valid match", () => {
        const result = validateInsertMatch({ foundId: 1, lostId: 1, matchProbability: 0.5 })
        expect(result.success).toBe(true)
    })
})
