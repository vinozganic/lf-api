const validateType = require("./typeValidation")
const validateColor = require("./colorValidation")
const validateLocation = require("./locationValidation")
const validateTime = require("./timeValidation")
const validateIdentifiable = require("./identifiableValidation")
const validatePhoneNumber = require("./phoneNumberValidation")

const validate = (body) => {
    const requiredFields = ["type", "subtype", "color", "location", "time", "identifiable", "phoneNumber"]
    const fields = Object.keys(body)
    const missingFields = requiredFields.filter((field) => !fields.includes(field))
    if (missingFields.length > 0) {
        return {
            error: {
                message: "Missing fields",
                missingFields,
            },
        }
    }

    const typeCheck = validateType(body)
    const colorCheck = validateColor(body)
    const locationCheck = validateLocation(body)
    const timeCheck = validateTime(body)
    const identifiableCheck = validateIdentifiable(body)
    const phoneNumberCheck = validatePhoneNumber(body)

    const errors = [typeCheck, colorCheck, locationCheck, timeCheck, identifiableCheck, phoneNumberCheck].filter(
        (check) => check.success === false
    )

    if (errors.length > 0) {
        return {
            success: false,
            errors,
        }
    }

    return { success: true }
}

module.exports = validate
