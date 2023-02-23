const { Found } = require("../db")
const validate = require("../validation/validation")
const { generateKey } = require("../helpers/trackingKey")

const addFound = async (body) => {
    let trackingKey = generateKey()
    let found = await Found.findOne({ trackingKey }) // Check if that trackingKey already exists
    while (found) {
        trackingKey = generateKey()
        found = await Found.findOne({ trackingKey })
    }

    const validationResult = validate(body)
    if (!validationResult.success) {
        return validationResult
    }

    const newFound = new Found({
        trackingKey,
        ...body,
    })
    await newFound.save()
    return { success: true, newFound }
}

module.exports = { addFound }
