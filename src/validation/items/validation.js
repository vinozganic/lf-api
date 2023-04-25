const validateType = require("./typeValidation")
const validateColor = require("./colorValidation")
const validateLocation = require("./locationValidation")
const validateDate = require("./dateValidation")
const validatePhoneNumber = require("./phoneNumberValidation")

const validate = (body) => {
    const requiredFields = ["type", "subtype", "color", "location", "date", "phoneNumber"]
    const fields = Object.keys(body)
    const missingFields = requiredFields.filter((field) => !fields.includes(field))
    if (missingFields.length > 0) {
        return {
            success: false,
            error: {
                message: `Missing ${missingFields[0]}.`,
            },
        }
    }

    const typeCheck = validateType(body)
    const colorCheck = validateColor(body)
    const locationCheck = validateLocation(body)
    const dateCheck = validateDate(body)
    const phoneNumberCheck = validatePhoneNumber(body)

    const errors = [typeCheck, colorCheck, locationCheck, dateCheck, phoneNumberCheck]
        .filter((check) => check.success === false)
        .map((check) => check.error.message)

    if (errors.length > 0) {
        return {
            success: false,
            error: {
                message: `${errors[0]}`,
            },
        }
    }

    return { success: true }
}

module.exports = validate
