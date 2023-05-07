const mongoose = require("mongoose")
const { Pool } = require("pg")
const amqplib = require("amqplib")

const createExtensionIfNotExistsQuery = (extensionName) => `
    CREATE EXTENSION IF NOT EXISTS "${extensionName}";
`
const createMatchesTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        found_id VARCHAR(24) NOT NULL,
        lost_id VARCHAR(24) NOT NULL,
        match_probability NUMERIC(7,6) NOT NULL,
        resolved BOOLEAN NOT NULL DEFAULT FALSE,
        nickname VARCHAR(255) NOT NULL
    );
`

const createNounsTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS nouns (
        noun VARCHAR(255) PRIMARY KEY NOT NULL,
        gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f'))
    );
`

const createAdjectivesTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS adjectives (
        adjective VARCHAR(255) PRIMARY KEY NOT NULL,
        gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f')) 
    );
`

const createAreasTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS areas (
        name VARCHAR(255) PRIMARY KEY NOT NULL,
        geo_json JSONB NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_areas_name ON areas(name);
`

const createTransportLinesTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS transport_lines (
        id SERIAL PRIMARY KEY NOT NULL,
        area_name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        number VARCHAR(255) NOT NULL,
        geo_json JSONB NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_transport_lines_area_name_type_number ON transport_lines(area_name, type, number);
`

const createConnectionStringsTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS connection_strings (
        name VARCHAR(255) PRIMARY KEY NOT NULL,
        value VARCHAR(255) NOT NULL
    );
`

const createTypesTableIfNotExistsQuery = `
    CREATE TABLE IF NOT EXISTS types (
        name VARCHAR(255) PRIMARY KEY NOT NULL,
        nice_name VARCHAR(255) NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_types_name ON types(name);
`

const Schema = mongoose.Schema

const itemSchema = new Schema(
    {
        date: {
            type: Date,
        },
    },
    { strict: false }
)
itemSchema.set("toJSON", {
    virtuals: true,
})

itemSchema.index({ location: "2dsphere" })

const Found = mongoose.model("found", itemSchema)
const Lost = mongoose.model("lost", itemSchema)

const connectToMongo = async () => {
    if (process.env.NODE_ENV === "test") {
        return
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}

const matchesConnector = new Pool({
    connectionString: process.env.MATCHES_URI,
})

const connectToMatches = async () => {
    if (process.env.NODE_ENV === "test") {
        return
    }
    try {
        await matchesConnector.connect()
        console.log("Connected to matches db")
        await matchesConnector.query(createExtensionIfNotExistsQuery("uuid-ossp"))
        await matchesConnector.query(createMatchesTableIfNotExistsQuery)
    } catch (error) {
        console.log(error)
    }
}

const configConnector = new Pool({
    connectionString: process.env.CONFIG_URI,
})

const connectToConfig = async () => {
    if (process.env.NODE_ENV === "test") {
        return
    }
    try {
        await configConnector.connect()
        console.log("Connected to config db")
        await configConnector.query(createAreasTableIfNotExistsQuery)
        await configConnector.query(createTransportLinesTableIfNotExistsQuery)
        await configConnector.query(createConnectionStringsTableIfNotExistsQuery)
        await configConnector.query(createTypesTableIfNotExistsQuery)
        await configConnector.query(createNounsTableIfNotExistsQuery)
        await configConnector.query(createAdjectivesTableIfNotExistsQuery)
    } catch (error) {
        console.log(error)
    }
}

let rabbitConnector = null
let rabbitChannel = null

const connectToQueue = async () => {
    while (!rabbitChannel) {
        try {
            if (process.env.NODE_ENV != "production") {
                rabbitConnector = await amqplib.connect(process.env.AMQP_ENDPOINT)
            } else {
                rabbitConnector = await amqplib.connect({
                    protocol: "amqp",
                    hostname: process.env.RABBITMQ_HOST,
                    port: process.env.RABBITMQ_PORT,
                    username: process.env.RABBITMQ_USERNAME,
                    password: process.env.RABBITMQ_PASSWORD,
                })
            }
            rabbitChannel = await rabbitConnector.createChannel()
            console.log("Connected to RabbitMQ")
        } catch (error) {
            console.log(error)
            console.log("RabbitMQ not up, waiting 10 seconds")
            console.log("--------------------")
            await new Promise((r) => setTimeout(r, 5000))
        }
    }
}

const sendToQueue = async (message) => {
    await rabbitChannel.sendToQueue("matcher.item_to_process", Buffer.from(message))
}

module.exports = {
    Found,
    Lost,
    connectToMongo,
    connectToMatches,
    connectToConfig,
    connectToQueue,
    matchesConnector,
    configConnector,
    sendToQueue,
}
