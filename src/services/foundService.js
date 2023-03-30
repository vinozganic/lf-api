const { Found } = require("../db")
const validate = require("../validation/items/validation")
const validateId = require("../validation/matches/idValidation")
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
    return { success: true, found: newFound }
}

const batch = async (body) => {
    const results = []
    for (const id of body) {
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
            const found = await Found.findOne({ _id: id })
            if (found) {
                results.push({
                    success: true,
                    body: found,
                })
            } else {
                results.push({
                    success: false,
                    id,
                    error: "Item not found for the given id.",
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

module.exports = { addFound, batch }
