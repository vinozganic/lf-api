const validateTime = require("../../src/validation/timeValidation")

describe("validateTime", () => {
    test("returns an error for empty time", () => {
        const result = validateTime({
            time: {},
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid time")
    })

    test("returns an error for empty startTime", () => {
        const result = validateTime({
            time: {
                startTime: "",
                endTime: Date("21.02.2021. 12:00"),
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid time")
    })

    test("returns an error for empty endTime", () => {
        const result = validateTime({
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: "",
            },
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid time")
    })

    test("returns success for valid time", () => {
        const result = validateTime({
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
        })
        expect(result.success).toBe(true)
    })
})
