const { configConnector } = require("../db")
const validateAreaId = require("../validation/config/areaIdValidator")

const getAreasQuery = `
    SELECT * FROM areas;
`

const getAreaByIdQuery = `
    SELECT * FROM areas WHERE id = $1;
`

const getTypesQuery = `
    SELECT * FROM types;   
`

const getSubtypesQuery = `
    SELECT * FROM subtypes;
`

const getTransportLinesQuery = `
    SELECT * FROM transport_lines WHERE area_id = $1;
`

const getAreas = async () => {
    const result = await configConnector.query(getAreasQuery)
    return { success: true, data: result.rows }
}

const getTypesAndSubtypes = async () => {
    const typesResult = await configConnector.query(getTypesQuery)
    const subtypesResult = await configConnector.query(getSubtypesQuery)

    const types = {}
    typesResult.rows.forEach((type) => {
        types[type.id] = type.name
    })

    const typesWithSubtypes = {}

    subtypesResult.rows.forEach((subtype) => {
        const typeName = types[subtype.type_id]
        if (!typesWithSubtypes[typeName]) {
            typesWithSubtypes[typeName] = []
        }
        typesWithSubtypes[typeName].push(subtype.name)
    })

    return { success: true, data: typesWithSubtypes }
}

const getTransportLines = async (areaId) => {
    const validationResult = validateAreaId(areaId)
    if (!validationResult.success) {
        return validationResult
    }
    const areaNameResult = await configConnector.query(getAreaByIdQuery, [areaId])
    if (areaNameResult.rows.length === 0) {
        return {
            success: false,
            error: {
                message: "Area with given id does not exist",
            },
        }
    }
    const transportLinesResult = await configConnector.query(getTransportLinesQuery, [areaId])
    const transportLines = transportLinesResult.rows.map((line) => {
        return {
            id: line.id,
            areaId: line.area_id,
            type: line.type,
            name: line.name,
            number: line.number,
            geoJson: line.geo_json,
        }
    })

    return {
        success: true,
        data: {
            areaName: areaNameResult.rows[0].name,
            transportLines: transportLines,
        },
    }
}

module.exports = { getAreas, getTypesAndSubtypes, getTransportLines }
