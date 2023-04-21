const validateInsertMatchesBatch = require("../../../src/validation/matches/insertMatchesBatchValidator")

describe("validateInsertMatchesBatch", () => {
    it("returns an error for wrong type", () => {
        const result = validateInsertMatchesBatch("string")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Body must be an array.")
    })
})

