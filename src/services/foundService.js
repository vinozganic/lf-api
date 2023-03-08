const { Found } = require("../db")
const validate = require("../validation/items/validation")
const { generateKey } = require("../helpers/trackingKey")

const addFound = async (body) => {
    const validationResult = validate(body)
    if (!validationResult.success) {
        return validationResult
    }

    const newFound = new Found({
        trackingKey: generateKey(),
        ...body,
    })
    await newFound.save()
    return { success: true, newFound }
}

module.exports = { addFound }
