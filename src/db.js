const mongoose = require("mongoose")
const { Client } = require("pg")

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

const postgresClient = new Client({
    connectionString: process.env.POSTGRES_URI,
})

const connectToPostgres = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await postgresClient.connect()
            console.log("Connected to PostgreSQL")
            await postgresClient.query(createTableIfNotExistsQuery)
        }
    } catch (error) {
        console.log(error)
    } finally {
        await postgresClient.end()
    }
}

const Schema = mongoose.Schema

const foundSchema = new Schema({}, { strict: false })
const Found = mongoose.model("found", foundSchema)

const lostSchema = new Schema({}, { strict: false })
const Lost = mongoose.model("lost", lostSchema)

module.exports = { Found, Lost, connectToMongo, connectToPostgres, postgresClient }
