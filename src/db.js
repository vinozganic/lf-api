const mongoose = require("mongoose")
const { Pool } = require("pg")

const createTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        found_id INTEGER NOT NULL,
        lost_id INTEGER NOT NULL,
        match_probability NUMERIC(7,6) NOT NULL
    );
`
const Schema = mongoose.Schema

const foundSchema = new Schema({}, { strict: false })
foundSchema.index({ location: "2dsphere" })
const Found = mongoose.model("found", foundSchema)
Found.createIndexes({ location: "2dsphere" })

const lostSchema = new Schema({}, { strict: false })
lostSchema.index({ location: "2dsphere" })
const Lost = mongoose.model("lost", lostSchema)
Lost.createIndexes({ location: "2dsphere" })

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

const pgConnector = new Pool({
    connectionString: process.env.POSTGRES_URI,
})

const connectToPostgres = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await pgConnector.connect()
            console.log("Connected to PostgreSQL")
            await pgConnector.query(createTableIfNotExistsQuery)
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { Found, Lost, connectToMongo, connectToPostgres, pgConnector }
