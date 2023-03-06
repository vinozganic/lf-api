const validate = require("../../src/validation/validation");

describe("validate", () => {

    test("returns an error for empty body", () => {
        const result = validate({       

        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["type", "subtype", "color", "location", "time", "identifiable", "phoneNumber"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["type"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["color"])
    })

    test("returns an error for missing location", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["location"])
    })

    test("returns an error for missing time", () => {
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
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["time"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["identifiable"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["phoneNumber"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Missing fields")
        expect(result.error.missingFields).toEqual(["type", "color"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid type"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid subtype"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid color format. Color must be an array of 3 numbers"])
    })

    test("returns an error for invalid location", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: "wrong format",
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid location type"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: "true",
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid identifiable"])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : 23
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid phone number. Phone number must be a string."])
    })

    test("returns an error for invalid time", () => {
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
            time: "wrong format",
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid time"])
    })

    test("returns an error for invalid location and time", () => {
        const result = validate({
            type: "tech",
            subtype: "laptop",
            color: [100, 200, 50],
            location: "wrong format",
            time: "wrong format",
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual(["Invalid location type", "Invalid time"])
    })

    test("returns an error for fully invalid body", () => {
        const result = validate({
            type: "not a type",
            subtype: "not a subtype",
            color: "red",
            location: "wrong format",
            time: "wrong format",
            identifiable: "true",
            phoneNumber : 23
        })
        expect(result.success).toBe(false)
        expect(result.errors).toEqual([
            "Invalid type",
            "Invalid color format. Color must be an array of 3 numbers",
            "Invalid location type",
            "Invalid time",
            "Invalid identifiable",
            "Invalid phone number. Phone number must be a string."])
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
            time: {
                startTime: Date("21.02.2021. 12:00"),
                endTime: Date("21.02.2022. 13:00"),
            },
            identifiable: true,
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(true)
    })

})



