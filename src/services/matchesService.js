const { pgConnector } = require('../db')
const validate = require('../validation/matches/validation')

const getMatchesByFoundIdQuery = () => `
    SELECT * FROM matches WHERE found_id=$1 ORDER BY matchProbability DESC;
`
const getMatchesByLostIdQuery = () => `
    SELECT * FROM matches WHERE lost_id=$1 ORDER BY matchProbability DESC;
`
const insertMatchQuery = () => `
    INSERT INTO matches VALUES ($1, $2, $3);
`
const getMatchesByFoundId = async (id) => {
    const validationResult = validate("getMatchesByFoundId", { id })
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
    const validationResult = validate("getMatchesByLostId", { id })
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
const insertMatch = async (foundId, lostId, matchProbability) => {
    const validationResult = validate("insertMatch", { foundId, lostId, matchProbability })
    if (!validationResult.success) {
        return validationResult
    }
    try {
        await pgConnector.query(insertMatchQuery, [foundId, lostId, matchProbability])
        return { success: true, match: { foundId, lostId, matchProbability } }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

module.exports = { getMatchesByFoundId, getMatchesByLostId, insertMatch }