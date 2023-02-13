const validateType = require("./typeValidation")
const validateSubType = require("./subTypeValidation")
const validateType = require("./locationValidation")

const requiredFields = ["type", "subtype", "color", "location", "time", "identifiable"]

const prepareValidation = (body) => {
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

    const isTypeValid = validateType(body)
    const isSubTypeValid = validateSubType(body)
}
