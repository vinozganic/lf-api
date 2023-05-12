const { StreamChat } = require("stream-chat")

const { Found, configConnector } = require("../db")
const validate = require("../validation/items/validation")
const validateIdList = require("../validation/matches/validateIdList")
const { generateKey } = require("../helpers/trackingKey")

const getTransportLineQuery = `
    SELECT * FROM transport_lines WHERE id = ANY($1);
`

const addFound = async (body) => {
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

    const newFound = new Found({
        ...body,
        trackingKey: generateKey(),
        // streamChatToken: "",
        date,
        location,
    })

    // const serverClient = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_SECRET)
    // const token = serverClient.createToken(newFound.id)
    // newFound.streamChatToken = token

    await newFound.save()
    return { success: true, data: newFound }
}

const getFound = async () => {
    const founds = await Found.find()
    return { success: true, data: founds }
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

module.exports = { addFound, getFound, getFoundBatch }
