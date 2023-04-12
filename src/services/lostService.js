const { Lost, matchesConnector, Found } = require("../db")
const validate = require("../validation/items/validation")
const validateIdList = require("../validation/matches/validateIdList")
const validateResolvedId = require("../validation/matches/resolvedIdValidation")
const { generateKey } = require("../helpers/trackingKey")

const removeWhereLostIdQuery = `
    DELETE FROM matches WHERE lost_id = $1
`
const removeWhereFoundIdQuery = `
    DELETE FROM matches WHERE found_id = $1
`

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
            lostItems: items,
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

const resolved = async (body) => {
    const validationResult = validateResolvedId(body)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const lostItem = await Lost.findOneAndUpdate({ _id: body.lostId }, { resolved: true }, { new: true })
        if (!lostItem) {
            return {
                success: false,
                error: {
                    message: "Lost item not found.",
                },
            }
        }
        await matchesConnector.query(removeWhereLostIdQuery, [body.lostId])
        if ("foundId" in Object.keys(body)) {
            const foundItem = await Found.findByIdAndUpdate({ _id: body.foundId }, { resolved: true }, { new: true })
            if (!foundItem) {
                return {
                    success: false,
                    error: {
                        message: "Found item not found.",
                    },
                }
            }
            await matchesConnector.query(removeWhereFoundIdQuery, [body.foundId])
            return {
                success: true,
                lostItem: lostItem,
                foundItem: foundItem,
            }
        }
        return {
            success: true,
            lostItem: lostItem,
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

module.exports = { addLost, getLostBatch, resolved }
