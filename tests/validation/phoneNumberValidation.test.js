const validatePhoneNumber = require("../../src/validation/phoneNumberValidation")

describe("validatePhoneNumber", () => {

    test("returns error when phone number is not a string", () => {
        const result = validatePhoneNumber({
            phoneNumber : 123456
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid phone number. Phone number must be a string.")
    });

    test("returns error when the phone number does nort match the regex", () => {

        const result = validatePhoneNumber({
            phoneNumber : "123456"
        })
        expect(result.success).toBe(false)
        expect(result.error.message).toBe("Invalid phone number.")
    });

    test("returns success when the phone number is valid", () => {
        const result = validatePhoneNumber({
            phoneNumber : "+385911125672"
        })
        expect(result.success).toBe(true)
    });
});