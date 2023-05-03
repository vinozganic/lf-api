const { matchesConnector, configConnector } = require("../db")
const validateInsertMatch = require("../validation/matches/insertMatchValidator")
const validateId = require("../validation/matches/idValidator")
const validateUuid = require("../validation/matches/uuidValidator")
const validateBatchInsertMatches = require("../validation/matches/insertMatchesBatchValidator")

const getMatchByIdQuery = `
    SELECT * FROM matches WHERE id=$1;
`
const getMatchesByFoundIdQuery = `
    SELECT * FROM matches WHERE found_id=$1 ORDER BY match_probability DESC;
`
const getMatchesByLostIdQuery = `
    SELECT * FROM matches WHERE lost_id=$1 ORDER BY match_probability DESC;
`
const insertMatchQuery = `
    INSERT INTO matches (found_id, lost_id, match_probability, nickname) VALUES ($1, $2, $3, $4) RETURNING id, found_id, lost_id, match_probability, resolved, nickname;
`
const getNounsByGenderQuery = `
    SELECT noun FROM nouns WHERE gender = $1;
`
const getAdjectivesByGenderQuery = `
    SELECT adjective FROM adjectives WHERE gender = $1;
`
const getNounsQuery = `
    SELECT * FROM nouns;
`
const getAdjectivesQuery = `
    SELECT * FROM adjectives;
`

const getMatchById = async (id) => {
    const validationResult = validateUuid(id)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const result = await matchesConnector.query(getMatchByIdQuery, [id])
        if (result.rows.length === 0) {
            return {
                success: false,
                error: {
                    message: "Match not found",
                },
            }
        }
        return {
            success: true,
            data: {
                id: result.rows[0].id,
                foundId: result.rows[0].found_id,
                lostId: result.rows[0].lost_id,
                matchProbability: result.rows[0].match_probability,
                resolved: result.rows[0].resolved,
                nickname: result.rows[0].nickname,
            },
        }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

const getMatchesByFoundId = async (id) => {
    const validationResult = validateId(id)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const values = []
        const result = await matchesConnector.query(getMatchesByFoundIdQuery, [id])
        for (const row of result.rows) {
            values.push({
                id: row.id,
                foundId: row.found_id,
                lostId: row.lost_id,
                matchProbability: Number(row.match_probability),
                resolved: row.resolved,
                nickname: row.nickname,
            })
        }
        return { success: true, data: values }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

const getMatchesByLostId = async (id) => {
    const validationResult = validateId(id)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const values = []
        const result = await matchesConnector.query(getMatchesByLostIdQuery, [id])
        for (const row of result.rows) {
            values.push({
                id: row.id,
                foundId: row.found_id,
                lostId: row.lost_id,
                matchProbability: Number(row.match_probability),
                resolved: row.resolved,
                nickname: row.nickname,
            })
        }
        return { success: true, data: values }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

const insertMatch = async (body) => {
    const validationResult = validateInsertMatch(body)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const gender = Math.random() < 0.5 ? "m" : "f"
        const nouns = await configConnector.query(getNounsByGenderQuery, [gender])
        const adjectives = await configConnector.query(getAdjectivesByGenderQuery, [gender])
        const noun = nouns.rows[Math.floor(Math.random() * nouns.rows.length)].noun
        const adjective = adjectives.rows[Math.floor(Math.random() * adjectives.rows.length)].adjective
        const nickname = `${adjective} ${noun}`
        const result = await matchesConnector.query(insertMatchQuery, [body.foundId, body.lostId, body.matchProbability, nickname])
        const insertedValues = result.rows[0]
        return {
            success: true,
            data: {
                id: insertedValues.id,
                foundId: insertedValues.found_id,
                lostId: insertedValues.lost_id,
                matchProbability: insertedValues.match_probability,
                resolved: insertedValues.resolved,
                nickname: insertedValues.nickname,
            },
        }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

const insertMatchesBatch = async (body) => {
    const validationResult = validateBatchInsertMatches(body)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        let insertedValuesList = []
        const nouns = await configConnector.query(getNounsQuery)
        const adjectives = await configConnector.query(getAdjectivesQuery)
        for (const match of body) {
            const gender = Math.random() < 0.5 ? "m" : "f"
            const noun = nouns.rows.filter((noun) => noun.gender === gender)[Math.floor(Math.random() * nouns.rows.filter((noun) => noun.gender === gender).length)].noun
            const adjective = adjectives.rows.filter((adjective) => adjective.gender === gender)[Math.floor(Math.random() * adjectives.rows.filter((adjective) => adjective.gender === gender).length)].adjective
            const nickname = `${adjective} ${noun}`
            const result = await matchesConnector.query(insertMatchQuery, [match.foundId, match.lostId, match.matchProbability, nickname])
            const insertedValues = result.rows[0]
            insertedValuesList.push({
                id: insertedValues.id,
                foundId: insertedValues.found_id,
                lostId: insertedValues.lost_id,
                matchProbability: insertedValues.match_probability,
                resolved: insertedValues.resolved,
                nickname: insertedValues.nickname,
            })
        }
        return {
            success: true,
            // data: insertedValuesList,
            // no need to send the inserted values back for now
        }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

module.exports = { getMatchById, getMatchesByFoundId, getMatchesByLostId, insertMatch, insertMatchesBatch }
