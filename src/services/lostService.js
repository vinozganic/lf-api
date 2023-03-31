const { Lost } = require("../db")
const validate = require("../validation/items/validation")
const validateIdList = require("../validation/matches/validateIdList")
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

const getLostBatch = async (body) => {
    const validationResult = validateIdList(body)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const items = await Lost.find({ _id: { $in: body } })
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

module.exports = { addLost, getLostBatch }
