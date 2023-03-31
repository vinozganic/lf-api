const { Found } = require("../db")
const validate = require("../validation/items/validation")
const validateIdList = require("../validation/matches/validateIdList")
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

const getFoundBatch = async (body) => {
    const validationResult = validateIdList(body)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const items = await Found.find({ _id: { $in: body } })
        return {
            success: true,
            matches: items,
        }
    } catch (error) {
        return {
            success: false,
            error: {
                message: error,
            },
        }
    }
}

module.exports = { addFound, getFoundBatch }
