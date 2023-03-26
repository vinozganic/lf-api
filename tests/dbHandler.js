const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { pgConnector } = require("../src/db")
let mongod = null

module.exports.connectToItemsDatabase = async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true,
        w: "majority",
        wtimeoutMS: 10000,
    }
    await mongoose.connect(uri, mongooseOpts)
}

module.exports.dropItemsDatabase = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
}

module.exports.dropItemsCollections = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany()
    }
}

module.exports.connectToMatchesDatabase = async () => {
    await pgConnector.connect()

    const createExtensionIfNotExistsQuery = (extensionName) => `
        CREATE EXTENSION IF NOT EXISTS "${extensionName}";
    `
    const createTempTableQuery = `
        CREATE TEMPORARY TABLE matches (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            found_id VARCHAR(24) NOT NULL,
            lost_id VARCHAR(24) NOT NULL,
            match_probability NUMERIC(7,6) NOT NULL
        );
    `

    await pgConnector.query(createExtensionIfNotExistsQuery("uuid-ossp"))
    await pgConnector.query(createTempTableQuery)

    return pgConnector
}

module.exports.clearMatchesTable = async (pgConnector) => {
    const clearMatchesTableQuery = `
        DELETE FROM matches;
    `
    await pgConnector.query(clearMatchesTableQuery)
}

module.exports.addMatch = async (pgConnector) => {
    const addMatchQuery = `
        INSERT INTO matches (id, found_id, lost_id, match_probability)
        VALUES ($1, $2, $3, $4);
    `
    const values = ["a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11", "64202bd46d22797759e9888c", "64202be6be38a05973e0c6c7", 0.5]

    await pgConnector.query(addMatchQuery, values)
}

module.exports.addMatches = async (pgConnector) => {
    const addMatchQuery = `
        INSERT INTO matches (id, found_id, lost_id, match_probability)
        VALUES ($1, $2, $3, $4);
    `
    const values = [
        ["3c5616a0-a9a2-4303-b7f8-7d98c8835a9c", "64202bd46d22797759e9888c", "64202be6be38a05973e0c6c7", 0.1],
        ["c055076d-352a-4faf-8885-d2053fd1e331", "64202bd46d22797759e9888c", "64202c0406f3608e8a18ecb2", 0.2],
        ["a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a13", "64202c0a63e40776a602a32c", "64202be6be38a05973e0c6c7", 0.3],
    ]

    for await (const value of values) {
        await pgConnector.query(addMatchQuery, value)
    }
}
