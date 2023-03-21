const validateInsertMatch = require("../../src/validation/matches/insertMatchValidator")

describe("validateInsertMatch", () => {
    test("returns an error for empty foundId", () => {
        const result = validateInsertMatch({ lostId: "45cbc4a0e4123f6920000002", matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })
    
    test("returns an error for invalid foundId format", () => {
        const result = validateInsertMatch({ foundId: false, lostId: "45cbc4a0e4123f6920000002", matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a string.")
    })

    test("returns an error when foundId does not match the regex", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002f", lostId: "45cbc4a0e4123f6920000002", matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns an error for invalid foundId format", () => {
        const result = validateInsertMatch({ foundId: false, matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a string.")
    })

    test("returns an error for empty lostId", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns an error for invalid lostId format", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: false, matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id. Id must be a string.")
    })

    test("returns an error when lostId does not match the regex", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: "45cbc4a0e4123f692000000", matchProbability: 0.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns an error when lostId does not match the regex", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: "45cbc4a0e4123f692000000z" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid id.")
    })

    test("returns an error for empty matchProbability", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: "45cbc4a0e4123f6920000002" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability.")
    })

    test("returns an error for invalid match probability format", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: "45cbc4a0e4123f6920000002", matchProbability: "not a number" })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be a number.")
    })

    test("returns an error for invalid match probability", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: "45cbc4a0e4123f6920000002", matchProbability: 1.5 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be between 0 and 1 (inclusive).")
    })

    test("returns an error for invalid match probability", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: "45cbc4a0e4123f6920000002", matchProbability: -1 })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid match probability. Match probability must be between 0 and 1 (inclusive).")
    })

    test("returns success for valid match", () => {
        const result = validateInsertMatch({ foundId: "45cbc4a0e4123f6920000002", lostId: "45cbc4a0e4123f6920000002", matchProbability: 0.5 })
        expect(result.success).toBe(true)
    })
})
