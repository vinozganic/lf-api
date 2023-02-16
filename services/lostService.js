const { Lost } = require("../db")
const validate = require("../validation/validation")

const addLost = async (body) => {
    const validationResult = validate(body)
    if (!validationResult.success) {
        return validationResult
    }
    const newLost = new Lost(body)
    await newLost.save()
    return { success: true, newLost }
}

module.exports = { addLost }
