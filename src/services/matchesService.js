const { pgConnector } = require('../db')
const { validateOnlyId, validateIdsAndMatchProbability } = require('../validation/matches/validation')

const getMatchesByFoundIdQuery = () => `
    SELECT * FROM matches WHERE found_id=$1 ORDER BY matchProbability DESC;
`
const getMatchesByLostIdQuery = () => `
    SELECT * FROM matches WHERE lost_id=$1 ORDER BY matchProbability DESC;
`
const insertMatchQuery = () => `
    INSERT INTO matches VALUES ($1, $2, $3) RETURNING found_id, lost_id, matchProbability;
`
const getMatchesByFoundId = async (id) => {
    const validationResult = validateOnlyId(id)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const result = await pgConnector.query(getMatchesByFoundIdQuery, [id])
        return { success: true, matches: result.rows }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}
const getMatchesByLostId = async (id) => {
    const validationResult = validateOnlyId(id)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const result = await pgConnector.query(getMatchesByLostIdQuery, [id])
        return { success: true, matches: result.rows }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}
const insertMatch = async (body) => {
    const validationResult = validateIdsAndMatchProbability(body)
    if (!validationResult.success) {
        return validationResult
    }
    try {
        const result = await pgConnector.query(insertMatchQuery, [body.foundId, body.lostId, body.matchProbability])
        const insertedValues = result.rows[0]
        return { 
            success: true, 
            match: { 
                foundId : insertedValues.found_id, 
                lostId : insertedValues.lost_id, 
                matchProbability : insertedValues.matchProbability 
            } }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

module.exports = { getMatchesByFoundId, getMatchesByLostId, insertMatch }