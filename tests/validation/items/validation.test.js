const validate = require("../../../src/validation/items/validation")

describe("validate", () => {
    test("returns an error for empty body", () => {
        const result = validate({})
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing type.")
    })

    test("returns an error for missing type", () => {
        const result = validate({
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing type.")
    })

    test("returns an error for missing color", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing color.")
    })

    test("returns an error for missing location", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing location.")
    })

    test("returns an error for missing date", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing date.")
    })

    test("returns an error for missing identifiable", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing identifiable.")
    })

    test("returns an error for missing phoneNumber", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing phoneNumber.")
    })

    test("returns an error for missing type and color", () => {
        const result = validate({
            subtype: "laptop",
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing type.")
    })

    test("returns an error for invalid type", () => {
        const result = validate({
            type: "wrong type",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid type.")
    })

    test("returns an error for invalid subtype", () => {
        const result = validate({
            type: "tech",
            subtype: "wrong subtype",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid subtype.")
    })

    test("returns an error for invalid color", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: "red",
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid color format. Color must be an array of 3 numbers.")
    })

    test("returns an error for invalid location", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: "wrong format",
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid location.")
    })

    test("returns an error for invalid identifiable", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: "true",
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid identifiable.")
    })

    test("returns an error for invalid phoneNumber", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: 23,
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid phone number. Phone number must be a string.")
    })

    test("returns an error for invalid date", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: "wrong format",
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid date.")
    })

    test("returns an error for invalid location and date", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: "wrong format",
            date: "wrong format",
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid location.")
    })

    test("returns an error for fully invalid body", () => {
        const result = validate({
            type: "not a type",
            subtype: "not a subtype",
            color: "red",
            location: "wrong format",
            date: "wrong format",
            identifiable: "true",
            phoneNumber: 23,
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toEqual("Invalid type.")
    })

    test("returns success for valid body", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: {
                type: "MultiLineString",
                coordinates: [
                    [
                        [179, 75],
                        [179, 75],
                    ],
                ],
                publicTransportLines: [1, 2, 3],
            },
            date: Date("21.02.2021. 12:00"),
            identifiable: true,
            phoneNumber: "+385911125672",
        })
        expect(result.success).toBe(true)
    })
})