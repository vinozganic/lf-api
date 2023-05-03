const request = require("supertest")
const app = require("../../src/app")
const {
    connectToItemsDatabase,
    dropItemsCollections,
    dropItemsDatabase,
    connectToMatchesDatabase,
    connectToConfigDatabase,
    addMatch,
    addMatches,
    addNouns,
    addAdjectives,
    clearMatchesTable,
    clearConfigTables,
} = require("../dbHandler")

let matchesConnector = null
let configConnector = null

beforeAll(async () => {
    await connectToItemsDatabase()
    matchesConnector = await connectToMatchesDatabase()
    configConnector = await connectToConfigDatabase()
})

afterEach(async () => {
    await dropItemsCollections()
    await clearMatchesTable(matchesConnector)
    await clearConfigTables(configConnector)
})

afterAll(async () => {
    await dropItemsDatabase()
})

describe("GET /matches/<id>", () => {
    it("should return 404", async () => {
        const res = await request(app).get("/matches/a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11")
        expect(res.statusCode).toEqual(404)
    })

    it("should return 400", async () => {
        const res = await request(app).get("/matches/invalid")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 200", async () => {
        await addMatch(matchesConnector)
        const res = await request(app).get("/matches/a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addMatch(matchesConnector)
        const res = await request(app).get("/matches/a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveProperty("id")
        expect(res.body.data).toHaveProperty("foundId")
        expect(res.body.data).toHaveProperty("lostId")
        expect(res.body.data).toHaveProperty("matchProbability")
        expect(res.body.data).toHaveProperty("resolved")
        expect(res.body.data).toHaveProperty("nickname")
    })
})

describe("GET /matches/lost/<lostId>", () => {
    it("should return 400", async () => {
        const res = await request(app).get("/matches/lost/invalid")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 200", async () => {
        await addMatch(matchesConnector)
        const res = await request(app).get("/matches/lost/64202be6be38a05973e0c6c7")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addMatches(matchesConnector)
        const res = await request(app).get("/matches/lost/64202be6be38a05973e0c6c7")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0]).toHaveProperty("id")
        expect(res.body.data[0]).toHaveProperty("foundId")
        expect(res.body.data[0]).toHaveProperty("lostId")
        expect(res.body.data[0]).toHaveProperty("matchProbability")
        expect(res.body.data[0]).toHaveProperty("resolved")
        expect(res.body.data[0]).toHaveProperty("nickname")
    })
})

describe("GET /matches/found/<foundId>", () => {
    it("should return 400", async () => {
        const res = await request(app).get("/matches/found/invalid")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 200", async () => {
        await addMatch(matchesConnector)
        const res = await request(app).get("/matches/found/64202bd46d22797759e9888c")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addMatches(matchesConnector)
        const res = await request(app).get("/matches/found/64202bd46d22797759e9888c")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveLength(2)
        expect(res.body.data[0]).toHaveProperty("id")
        expect(res.body.data[0]).toHaveProperty("foundId")
        expect(res.body.data[0]).toHaveProperty("lostId")
        expect(res.body.data[0]).toHaveProperty("matchProbability")
        expect(res.body.data[0]).toHaveProperty("resolved")
        expect(res.body.data[0]).toHaveProperty("nickname")
    })
})

describe("POST /matches", () => {
    it("should return 400", async () => {
        const res = await request(app).post("/matches")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 201", async () => {
        await addNouns(configConnector)
        await addAdjectives(configConnector)
        const res = await request(app).post("/matches").send({
            foundId: "64202bd46d22797759e9888c",
            lostId: "64202be6be38a05973e0c6c7",
            matchProbability: 0.5,
        })
        expect(res.statusCode).toEqual(201)
    })

    it("should have correct response body", async () => {
        await addNouns(configConnector)
        await addAdjectives(configConnector)
        const res = await request(app).post("/matches").send({
            foundId: "64202bd46d22797759e9888c",
            lostId: "64202be6be38a05973e0c6c7",
            matchProbability: 0.5,
        })
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveProperty("id")
        expect(res.body.data).toHaveProperty("foundId")
        expect(res.body.data).toHaveProperty("lostId")
        expect(res.body.data).toHaveProperty("matchProbability")
        expect(res.body.data).toHaveProperty("resolved")
        expect(res.body.data).toHaveProperty("nickname")
    })
})

describe("POST /matches/batch", () => {
    it("should return 400", async () => {
        const res = await request(app).post("/matches/batch")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 201", async () => {
        await addNouns(configConnector)
        await addAdjectives(configConnector)
        const res = await request(app)
            .post("/matches/batch")
            .send([
                {
                    foundId: "64202bd46d22797759e9888c",
                    lostId: "64202be6be38a05973e0c6c7",
                    matchProbability: 0.5,
                },
                {
                    foundId: "64202be6be38a05973e0c6c7",
                    lostId: "64202bd46d22797759e9888c",
                    matchProbability: 0.3,
                },
            ])
        expect(res.statusCode).toEqual(201)
    })
})
