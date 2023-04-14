const { Lost, matchesConnector, Found } = require('../db')
const validate = require('../validation/items/validation')
const validateIdList = require('../validation/matches/validateIdList')
const validateId = require('../validation/matches/idValidation')
const { generateKey } = require('../helpers/trackingKey')

const updateResolveQuery = `
    UPDATE matches SET resolved = true WHERE lost_id = $1 OR found_id = $2
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

const resolve = async (body) => {
    const validateLostId = validateId(body.lostId)
    let validateFoundId = { success: true }
    if (body.hasOwnProperty('foundId')) {
        validateFoundId = validateId(body.foundId)
    }
    if (!validateLostId.success || !validateFoundId.success) {
        return {
            success: false,
            error: {
                message: 'Invalid id.',
            },
        }
    }
    try {
        const lostItemExists = await Lost.exists({ _id: body.lostId })
        let foundId = 'null'
        let foundItemExists = true
        if (body.hasOwnProperty('foundId')) {
            foundId = body.foundId
            foundItemExists = await Found.exists({ _id: body.foundId })
            if (lostItemExists && foundItemExists) {
                await Lost.findOneAndUpdate({ _id: body.lostId }, { resolved: true })
                await Found.findOneAndUpdate({ _id: body.foundId }, { resolved: true })
            } else {
                return {
                    success: false,
                    error: {
                        message: 'Item does not exist.',
                    },
                }
            }
        } else {
            if (lostItemExists) {
                await Lost.findOneAndUpdate({ _id: body.lostId }, { resolved: true })
            } else {
                return {
                    success: false,
                    error: {
                        message: 'Item does not exist.',
                    },
                }
            }
        }
        await matchesConnector.query(updateResolveQuery, [body.lostId, foundId])
        return {
            success: true,
            message: `Resolved lost item with id: ${body.lostId}`,
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

module.exports = { addLost, getLostBatch, resolve }
