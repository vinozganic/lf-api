const { Found } = require("../db")
const validate = require("../validation/validation")

const addFound = async (body) => {
    const validationResult = validate(body)
    if (!validationResult.success) {
        return validationResult
    }
    const newFound = new Found(body)
    await newFound.save()
    return { success: true, newFound }
}

module.exports = { addFound }
