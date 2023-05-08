const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { matchesConnector, configConnector } = require("../src/db")
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
    await matchesConnector.connect()

    const createExtensionIfNotExistsQuery = (extensionName) => `
        CREATE EXTENSION IF NOT EXISTS "${extensionName}";
    `
    const createTempTableQuery = `
        CREATE TEMPORARY TABLE matches (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            found_id VARCHAR(24) NOT NULL,
            lost_id VARCHAR(24) NOT NULL,
            match_probability NUMERIC(7,6) NOT NULL,
            resolved BOOLEAN NOT NULL DEFAULT FALSE,
            nickname VARCHAR(255) NOT NULL
        );
    `

    await matchesConnector.query(createExtensionIfNotExistsQuery("uuid-ossp"))
    await matchesConnector.query(createTempTableQuery)

    return matchesConnector
}

module.exports.clearMatchesTable = async (matchesConnector) => {
    const clearMatchesTableQuery = `
        DELETE FROM matches;
    `
    await matchesConnector.query(clearMatchesTableQuery)
}

module.exports.addMatch = async (matchesConnector) => {
    const addMatchQuery = `
        INSERT INTO matches (id, found_id, lost_id, match_probability, nickname)
        VALUES ($1, $2, $3, $4, $5);
    `
    const values = ["a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11", "64202bd46d22797759e9888c", "64202be6be38a05973e0c6c7", 0.5, "Smeđa kokoš"]

    await matchesConnector.query(addMatchQuery, values)
}

module.exports.addMatches = async (matchesConnector) => {
    const addMatchQuery = `
        INSERT INTO matches (id, found_id, lost_id, match_probability, resolved, nickname)
        VALUES ($1, $2, $3, $4, $5, $6);
    `
    const values = [
        ["3c5616a0-a9a2-4303-b7f8-7d98c8835a9c", "64202bd46d22797759e9888c", "64202be6be38a05973e0c6c7", 0.1, false, "Smeđa kokoš"],
        ["c055076d-352a-4faf-8885-d2053fd1e331", "64202bd46d22797759e9888c", "64202c0406f3608e8a18ecb2", 0.2, false, "Smeđa kokoš"],
        ["a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a13", "64202c0a63e40776a602a32c", "64202be6be38a05973e0c6c7", 0.3, false, "Smeđa kokoš"],
        ["0819f165-478e-4dcd-a6de-129f7c3f82d3", "64202c0a63e40776a111a32c", "64202c1111f3608e8a18ecb2", 0.4, true, "Smeđa kokoš"],
    ]

    for await (const value of values) {
        await matchesConnector.query(addMatchQuery, value)
    }
}

module.exports.connectToConfigDatabase = async () => {
    await configConnector.connect()

    const createExtensionIfNotExistsQuery = (extensionName) => `
        CREATE EXTENSION IF NOT EXISTS "${extensionName}";
    `
    const createTempTablesQuery = `
        CREATE TEMPORARY TABLE IF NOT EXISTS areas (
            name VARCHAR(255) PRIMARY KEY NOT NULL,
            geo_json JSONB NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_areas_name ON areas(name);

        CREATE TEMPORARY TABLE types (
            name VARCHAR(255) PRIMARY KEY NOT NULL,
            nice_name VARCHAR(255) NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_types_name ON types(name);

        CREATE TEMPORARY TABLE transport_lines (
            id SERIAL PRIMARY KEY NOT NULL,
            area_name VARCHAR(255) NOT NULL,
            type VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            number VARCHAR(255) NOT NULL,
            geo_json JSONB NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_transport_lines_area_name_type_number ON transport_lines(area_name, type, number);

        CREATE TEMPORARY TABLE IF NOT EXISTS nouns (
            noun VARCHAR(255) PRIMARY KEY NOT NULL,
            gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f'))
        );

        CREATE TEMPORARY TABLE IF NOT EXISTS adjectives (
            adjective VARCHAR(255) PRIMARY KEY NOT NULL,
            gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f')) 
        );
    `

    await configConnector.query(createExtensionIfNotExistsQuery("uuid-ossp"))
    await configConnector.query(createTempTablesQuery)

    return configConnector
}

module.exports.clearConfigTables = async (configConnector) => {
    const clearConfigTablesQuery = `
        DELETE FROM areas;
        DELETE FROM types;
        DELETE FROM transport_lines;
        DELETE FROM nouns;
        DELETE FROM adjectives;
    `
    await configConnector.query(clearConfigTablesQuery)
}

module.exports.addArea = async (configConnector) => {
    const addAreaQuery = `
        INSERT INTO areas (name, geo_json)
        VALUES ($1, $2);
    `

    const geoJson = JSON.stringify({
        type: "Polygon",
        coordinates: [
            [
                [0, 0],
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0],
            ],
        ],
    })

    const values = ["Zagreb", geoJson]

    await configConnector.query(addAreaQuery, values)
}

module.exports.addTypes = async (configConnector) => {
    const addTypeQuery = `
        INSERT INTO types (name, nice_name)
        VALUES ($1, $2);
    `

    const values = ["mobilePhone", "Mobitel"]

    await configConnector.query(addTypeQuery, values)
}

module.exports.addTransportLine = async (configConnector) => {
    const addTransportLineQuery = `
        INSERT INTO transport_lines (area_name, type, name, number, geo_json)
        VALUES ($1, $2, $3, $4, $5);
    `
    const values = [
        "Zagreb",
        "tram",
        "Borongaj - Prečko",
        "32",
        {
            type: "LineString",
            coordinates: [
                [0, 0],
                [1, 1],
            ],
        },
    ]

    await configConnector.query(addTransportLineQuery, values)
}

module.exports.addNouns = async (configConnector) => {
    const addNounQuery = `
        INSERT INTO nouns (noun, gender)
        VALUES ($1, $2);
    `
    const values = [
        ["ptica", "f"],
        ["mačka", "f"],
        ["pas", "m"],
        ["konj", "m"],
        ["žaba", "f"],
        ["riba", "f"],
        ["kornjača", "f"],
        ["kokoš", "f"],
        ["golub", "m"],
        ["lisica", "f"],
        ["medvjed", "m"],
        ["vuk", "m"],
        ["lav", "m"],
        ["tigar", "m"],
        ["slon", "m"],
        ["žirafa", "f"],
        ["zebra", "f"],
        ["krokodil", "m"],
        ["pingvin", "m"],
        ["ždral", "m"],
        ["žohar", "m"],
        ["pčela", "f"],
        ["mrav", "m"],
        ["puž", "m"],
        ["zmija", "f"],
        ["magarac", "m"],
        ["svinja", "f"],
        ["krava", "f"],
        ["ovca", "f"],
        ["koza", "f"],
    ]

    for await (const value of values) {
        await configConnector.query(addNounQuery, value)
    }
}

module.exports.addAdjectives = async (configConnector) => {
    const addAdjectiveQuery = `
        INSERT INTO adjectives (adjective, gender)
        VALUES ($1, $2);
    `

    const values = [
        ["Crni", "m"],
        ["Crna", "f"],
        ["Bijeli", "m"],
        ["Bijela", "f"],
        ["Žuti", "m"],
        ["Žuta", "f"],
        ["Plavi", "m"],
        ["Plava", "f"],
        ["Crveni", "m"],
        ["Crvena", "f"],
        ["Zeleni", "m"],
        ["Zelena", "f"],
        ["Sivi", "m"],
        ["Siva", "f"],
        ["Ljubičasti", "m"],
        ["Ljubičasta", "f"],
        ["Narančasti", "m"],
        ["Narančasta", "f"],
        ["Rozi", "m"],
        ["Roza", "f"],
        ["Smeđi", "m"],
        ["Smeđa", "f"],
        ["Veliki", "m"],
        ["Velika", "f"],
        ["Mali", "m"],
        ["Mala", "f"],
        ["Brzi", "m"],
        ["Brza", "f"],
        ["Spori", "m"],
        ["Spora", "f"],
    ]

    for await (const value of values) {
        await configConnector.query(addAdjectiveQuery, value)
    }
}
