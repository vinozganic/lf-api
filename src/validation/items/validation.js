const validateType = require("./typeValidation")
const validateColor = require("./colorValidation")
const validateLocation = require("./locationValidation")
const validateTime = require("./timeValidation")
const validateIdentifiable = require("./identifiableValidation")
const validatePhoneNumber = require("./phoneNumberValidation")

const validate = (body) => {
    const requiredFields = ["type", "subtype", "color", "location", "time", "identifiable", "phoneNumber"]
    const fields = Object.keys(body)
    const missingField = requiredFields.filter((field) => !fields.includes(field))[0]
    if (missingField) {
        return {
            success: false,
            error: {
                message: "Missing field",
                missingField,
            },
        }
    }

    const typeCheck = validateType(body)
    const colorCheck = validateColor(body)
    const locationCheck = validateLocation(body)
    const timeCheck = validateTime(body)
    const identifiableCheck = validateIdentifiable(body)
    const phoneNumberCheck = validatePhoneNumber(body)

    const error = [typeCheck, colorCheck, locationCheck, timeCheck, identifiableCheck, phoneNumberCheck]
        .filter((check) => check.success === false)
        .map((check) => check.error.message)
        [0]

    if (error) {
        return {
            success: false,
            error,
        }
    }

    return { success: true }
}

module.exports = validate
