const mongoose = require("mongoose")
const { Pool } = require("pg")

const createExtensionIfNotExistsQuery = (extensionName) => `
    CREATE EXTENSION IF NOT EXISTS "${extensionName}";
`
const createMatchesTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        found_id VARCHAR(24) NOT NULL,
        lost_id VARCHAR(24) NOT NULL,
        match_probability NUMERIC(7,6) NOT NULL
        resolved BOOLEAN NOT NULL DEFAULT FALSE
    );
`

const createAreasTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS areas (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        geo_json JSONB NOT NULL
    );
`

const createTransportLinesTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS transit_lines (
        id SERIAL PRIMARY KEY NOT NULL,
        area_id INTEGER NOT NULL,
        type VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        geo_json JSONB NOT NULL
    );
`

const createConnectionStringsTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS connection_strings (
        name VARCHAR(255) PRIMARY KEY NOT NULL,
        value VARCHAR(255) NOT NULL
    );
`
        
const Schema = mongoose.Schema

const itemSchema = new Schema({}, { strict: false })
itemSchema.index({ location: "2dsphere" })

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

const matchesConnector = new Pool({
    connectionString: process.env.MATCHES_URI,
})

const connectToMatches = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await matchesConnector.connect()
            console.log("Connected to matches db")
            await matchesConnector.query(createExtensionIfNotExistsQuery("uuid-ossp"))
            await matchesConnector.query(createMatchesTableIfNotExistsQuery)
        }
    } catch (error) {
        console.log(error)
    }
}

const configConnector = new Pool({
    connectionString: process.env.CONFIG_URI,
})

const connectToConfig = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await configConnector.connect()
            console.log("Connected to config db")
            await configConnector.query(createAreasTableIfNotExistsQuery)
            await configConnector.query(createTransportLinesTableIfNotExistsQuery)
            await configConnector.query(createConnectionStringsTableIfNotExistsQuery)
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports = { Found, Lost, connectToMongo, connectToMatches, connectToConfig, matchesConnector, configConnector }
