const mongoose = require("mongoose")
const { Pool } = require("pg")

const createExtensionIfNotExistsQuery = (extensionName) => `
    CREATE EXTENSION IF NOT EXISTS "${extensionName}";
`
const createTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        found_id VARCHAR(24) NOT NULL,
        lost_id VARCHAR(24) NOT NULL,
        match_probability NUMERIC(7,6) NOT NULL
    );
`
const Schema = mongoose.Schema

const itemSchema = new Schema({}, { strict: false })
itemSchema.index({ location: "2dsphere" }, { unique: true })

const Found = mongoose.model("found", itemSchema)
const Lost = mongoose.model("lost", itemSchema)

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
            await pgConnector.query(createExtensionIfNotExistsQuery("uuid-ossp"))
            await pgConnector.query(createTableIfNotExistsQuery)
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = { Found, Lost, connectToMongo, connectToPostgres, pgConnector }
