const validateUuid = require("../../src/validation/matches/uuidValidator")

describe("validateUuid", () => {
    test("returns an error for empty uuid", () => {
        const result = validateUuid()
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid uuid.")
    })

    test("returns an error for invalid type", () => {
        const result = validateUuid(0)
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid uuid. Must be a string.")
    })

    test("returns an error when uuid does not match the regex", () => {
        const result = validateUuid("aaaaaaaaaa")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid uuid.")
    })

    test("returns an error when uuid does not match the regex", () => {
        const result = validateUuid("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid uuid.")
    })

    test("returns an error when uuid does not match the regex", () => {
        const result = validateUuid("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11a")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid uuid.")
    })

    test("returns an error when uuid does not match the regex", () => {
        const result = validateUuid("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a1z")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid uuid.")
    })

    test("returns an error when uuid does not match the regex", () => {
        const result = validateUuid("a0-eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid uuid.")
    })

    test("returns success for valid uuid", () => {
        const result = validateUuid("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        expect(result.success).toBe(true)
    })

    test("returns success for valid uuid", () => {
        const result = validateUuid("a0eebc999c0b4ef8bb6d6bb9bd380a11")
        expect(result.success).toBe(true)
    })

    test("returns success for valid uuid", () => {
        const result = validateUuid("a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11")
        expect(result.success).toBe(true)
    })
})