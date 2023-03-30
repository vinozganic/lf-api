const { Lost } = require("../db")
const validate = require("../validation/items/validation")
const validateId = require("../validation/matches/idValidation")
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
    return { success: true, lost: newLost }
}

const batch = async (body) => {
    const results = []
    for (const element of body) {
        const { id } = element
        const validationResult = validateId(id)
        if (!validationResult.success) {
            results.push({
                success: false,
                id,
                error: validationResult.error.message,
            })
            continue
        }
        try {
            const lost = await Lost.findOne({ _id: id })
            if (lost) {
                results.push({
                    success: true,
                    body: lost,
                })
            } else {
                results.push({
                    success: false,
                    id,
                    error: "Item not lost for the given id.",
                })
            }
        } catch (error) {
            results.push({
                success: false,
                id,
                error,
            })
        }
    }
    return results
}

module.exports = { addLost, batch }
