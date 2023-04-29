const { configConnector } = require("../db")
const getAreasQuery = `
    SELECT * FROM areas;
`

const getAreaByNameQuery = `
    SELECT * FROM areas WHERE name = $1;
`

const getTypesQuery = `
    SELECT * FROM types;   
`

const getTransportLinesQuery = `
    SELECT * FROM transport_lines WHERE area_name = $1;
`

const getAreas = async () => {
    const result = await configConnector.query(getAreasQuery)
    return {
        success: true,
        data: result.rows.map((row) => {
            return {
                name: row.name,
                geoJson: row.geo_json,
            }
        }),
    }
}

const getTypes = async () => {
    const typesResult = await configConnector.query(getTypesQuery)
    return {
        success: true,
        data: typesResult.rows.map((row) => {
            return {
                name: row.name,
                niceName: row.nice_name,
            }
        }),
    }
}

const getTransportLines = async (areaId) => {
    const areaNameResult = await configConnector.query(getAreaByNameQuery, [areaId])
    if (areaNameResult.rows.length === 0) {
        return {
            success: false,
            error: {
                message: "Area with that name does not exist",
            },
        }
    }
    const transportLinesResult = await configConnector.query(getTransportLinesQuery, [areaId])
    const transportLines = transportLinesResult.rows.map((line) => {
        return {
            id: line.id,
            areaName: line.area_name,
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

module.exports = { getAreas, getTypes, getTransportLines }
