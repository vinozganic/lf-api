const validateIdentifiable = require("../../src/validation/identifiableValidation")

describe("Identifiable Validation", () => {
    test("returns an error for empty identifiable", () => {
        const result = validateIdentifiable({
            identifiable: {},
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid identifiable")
    });

    test("returns an error for non boolean identifiable", () => {
        const result = validateIdentifiable({
            identifiable: "true",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid identifiable")
    });

    test("returns success for true identifiable", () => {
        const result = validateIdentifiable({
            identifiable: true,
        })
        expect(result.success).toBe(true)
    });
});
