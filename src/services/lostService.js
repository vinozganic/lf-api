const { StreamChat } = require("stream-chat")

const { Lost, Found, configConnector, matchesConnector } = require("../db")
const validate = require("../validation/items/validation")
const validateIdList = require("../validation/matches/validateIdList")
const validateId = require("../validation/matches/idValidator")
const { generateKey } = require("../helpers/trackingKey")

const getTransportLineQuery = `
    SELECT * FROM transport_lines WHERE id = ANY($1);
`

const updateResolveQuery = `
    UPDATE matches SET resolved = true WHERE lost_id = $1 OR found_id = $2
`

const addLost = async (body) => {
    const validationResult = validate(body)
    if (!validationResult.success) {
        return validationResult
    }

    const date = new Date(body.date)

    let path = null
    let publicTransportLines = []
    if (body.location.path) {
        path = {
            type: body.location.path.type,
            coordinates: body.location.path.coordinates,
        }
    }

    if (body.location.publicTransportLines) {
        const transportLines = await configConnector.query(getTransportLineQuery, [body.location.publicTransportLines])
        const transportLineGeoJsons = transportLines.rows.map((line) => line.geo_json)
        publicTransportLines = transportLineGeoJsons
    }

    const location = {
        path: path,
        publicTransportLines: publicTransportLines,
    }

    const newLost = new Lost({
        ...body,
        trackingKey: generateKey(),
        // streamChatToken: "",
        date,
        location,
    })

    // const serverClient = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_SECRET)
    // const token = serverClient.createToken(newLost.id)
    // newLost.streamChatToken = token

    await newLost.save()
    return { success: true, data: newLost }
}

const getLost = async () => {
    const losts = await Lost.find()
    return { success: true, data: losts }
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
            data: items,
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
    if (body.hasOwnProperty("foundId")) {
        validateFoundId = validateId(body.foundId)
    }
    if (!validateLostId.success || !validateFoundId.success) {
        return {
            success: false,
            error: {
                message: "Invalid id.",
            },
        }
    }
    try {
        let foundId = "null"
        const lostItem = await Lost.findOneAndUpdate({ _id: body.lostId }, { resolved: true }, { new: true })
        if (!lostItem) {
            return {
                success: false,
                error: {
                    message: "Item not found.",
                },
            }
        }
        if (body.hasOwnProperty("foundId")) {
            foundId = body.foundId
            const foundItem = await Found.findOneAndUpdate({ _id: body.foundId }, { resolved: true }, { new: true })
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

module.exports = { addLost, getLostBatch, getLost, resolve }
