const mongoose = require("mongoose")
const { Pool } = require("pg")

const createTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        found_id INTEGER NOT NULL,
        lost_id INTEGER NOT NULL,
        matchProbability NUMERIC(7,6) NOT NULL
    );
`
const connectToMongo = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            console.log("Connected to MongoDB")
        }
    } catch (error) {
        console.log(error)
    }
}

const postgresPool = new Pool({
    connectionString: process.env.POSTGRES_URI,
})

const connectToPostgres = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await postgresPool.connect()
            console.log("Connected to PostgreSQL")
            await postgresPool.query(createTableIfNotExistsQuery)
        }
    } catch (error) {
        console.log(error)
    }
}

const Schema = mongoose.Schema

const foundSchema = new Schema({}, { strict: false })
const Found = mongoose.model("found", foundSchema)

const lostSchema = new Schema({}, { strict: false })
const Lost = mongoose.model("lost", lostSchema)

module.exports = { Found, Lost, connectToMongo, connectToPostgres, postgresPool }
