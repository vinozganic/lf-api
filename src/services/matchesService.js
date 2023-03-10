const { pgConnector } = require('../db')
const validateInsertMatch = require('../validation/matches/insertMatchValidator')
const validateId = require('../validation/matches/idValidation')

const getMatchesByFoundIdQuery = () => `
    SELECT * FROM matches WHERE found_id=$1 ORDER BY match_probability DESC;
`
const getMatchesByLostIdQuery = () => `
    SELECT * FROM matches WHERE lost_id=$1 ORDER BY match_probability DESC;
`
const insertMatchQuery = () => `
    INSERT INTO matches (found_id, lost_id, match_probability) VALUES ($1, $2, $3) RETURNING found_id, lost_id, match_probability;
`
const getMatchesByFoundId = async (id) => {
    const validationResult = validateId(id)
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
    const validationResult = validateId(id)
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
    const validationResult = validateInsertMatch(body)
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
                matchProbability : insertedValues.match_probability 
            } 
        }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

module.exports = { getMatchesByFoundId, getMatchesByLostId, insertMatch }