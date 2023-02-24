const { Lost } = require("../db")
const validate = require("../validation/validation")
const { generateKey } = require("../helpers/trackingKey")

const addLost = async (body) => {
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
