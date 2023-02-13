const validateType = require("./typeValidation")
const validateSubType = require("./subTypeValidation")
const validateColor = require("./colorValidation")
const validateLocation = require("./locationValidation")
const validateTime = require("./timeValidation")
const validateIdentifiable = require("./identifiableValidation")

const validate = (body) => {
    const requiredFields = ["type", "subtype", "color", "location", "time", "identifiable"]
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
    // const subTypeCheck = validateSubType(body)
    const colorCheck = validateColor(body)
    const locationCheck = validateLocation(body)
    const timeCheck = validateTime(body)
    const identifiableCheck = validateIdentifiable(body)

    console.log(typeCheck, colorCheck, locationCheck, timeCheck, identifiableCheck)

    const errors = [typeCheck, colorCheck, locationCheck, timeCheck, identifiableCheck].filter((check) => check.success === false)
    if (errors.length > 0) {
        return {
            success: false,
            errors,
        }
    }

    return { success: true }
}

module.exports = validate
