const { postgresPool } = require('../db')

const matchThreshold = 0.6

const getMatchesByIdQuery = (type) => `
    SELECT * FROM matches WHERE ${type}=$1 ORDER BY matchProbability DESC;
`
const insertMatchQuery = () => `
    INSERT INTO matches VALUES ($1, $2, $3);
`
const getMatchesById = async (type, id) => {
    const typeQueryParametar = type === 'found' ? 'found_id' : 'lost_id'
    try {
        const result = await postgresPool.query(getMatchesByIdQuery(typeQueryParametar), [id])
        return { success: true, matches: result.rows }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}
const insertMatch = async (foundId, lostId, matchProbability) => {
    try {
        if (matchProbability > 1) return { success: false, message: 'Match probability cannot be greater than 1.'}
        if (matchProbability < matchThreshold) return { success: false, message: 'Match probability is too low.'}
        await postgresPool.query(insertMatchQuery, [foundId, lostId, matchProbability])
        return { success: true }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

module.exports = { getMatchesById, insertMatch }