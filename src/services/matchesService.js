const { postgresClient } = require('../db')

const matchThreshold = 0.6

const getMatchesByIdQuery = (type, id) => `
    SELECT * FROM matches WHERE ${type}=${id} ORDER BY matchProbability DESC;
`
const insertMatchQuery = (foundId, lostId, matchProbability) => `
    INSERT INTO matches VALUES (${foundId}, ${lostId}, ${matchProbability});
`
const getMatchesById = async (type, id) => {
    const typeQueryParametar = type === 'found' ? 'found_id' : 'lost_id'
    try {
        const result = await postgresClient.query(getMatchesByIdQuery(typeQueryParametar, id))
        return { success: true, matches: result.rows }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    } finally {
        await postgresClient.end()
    }
}
const insertMatch = async (foundId, lostId, matchProbability) => {
    try {
        if (matchProbability > 1) return { success: false, message: 'Match probability cannot be greater than 1.'}
        if (matchProbability < matchThreshold) return { success: false, message: 'Match probability is too low.'}
        await postgresClient.query(insertMatchQuery(foundId, lostId, matchProbability))
        return { success: true }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    } finally {
        await postgresClient.end()
    }
}

module.exports = { getMatchesById, insertMatch }