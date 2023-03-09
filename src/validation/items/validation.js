const validateType = require("./typeValidation")
const validateColor = require("./colorValidation")
const validateLocation = require("./locationValidation")
const validateDate = require("./dateValidation")
const validateIdentifiable = require("./identifiableValidation")
const validatePhoneNumber = require("./phoneNumberValidation")

const validate = (body) => {
    const requiredFields = ["type", "subtype", "color", "location", "date", "identifiable", "phoneNumber"]
    const fields = Object.keys(body)
    const missingFields = requiredFields.filter((field) => !fields.includes(field))
    if (missingFields.length > 0) {
        return {
            success: false,
            error: {
                message: "Missing fields",
                missingFields,
            },
        }
    }

    const typeCheck = validateType(body)
    const colorCheck = validateColor(body)
    const locationCheck = validateLocation(body)
    const dateCheck = validateDate(body)
    const identifiableCheck = validateIdentifiable(body)
    const phoneNumberCheck = validatePhoneNumber(body)

    const errors = [typeCheck, colorCheck, locationCheck, dateCheck, identifiableCheck, phoneNumberCheck]
        .filter((check) => check.success === false)
        .map((check) => check.error.message)

    if (errors.length > 0) {
        return {
            success: false,
            errors,
        }
    }

    return { success: true }
}

module.exports = validate