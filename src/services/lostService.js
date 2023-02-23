const { Lost } = require("../db")
const validate = require("../validation/validation")
const { generateKey } = require("../helpers/trackingKey")

const addLost = async (body) => {
    let trackingKey = generateKey()
    let found = await Lost.findOne({ trackingKey }) // Check if that trackingKey already exists
    while (found) {
        trackingKey = generateKey()
        found = await Lost.findOne({ trackingKey })
    }

    const validationResult = validate(body)
    if (!validationResult.success) {
        return validationResult
    }

    const newLost = new Lost({
        trackingKey: generateKey(),
        ...body,
    })
    await newLost.save()
    return { success: true, newLost }
}

module.exports = { addLost }
