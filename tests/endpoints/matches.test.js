const request = require("supertest")
const app = require("../../src/app")
const {
    connectToItemsDatabase,
    dropItemsCollections,
    dropItemsDatabase,
    connectToMatchesDatabase,
    addMatch,
    addMatches,
    clearMatchesTable,
} = require("../dbHandler")

let pgConnector = null

beforeAll(async () => {
    await connectToItemsDatabase()
    pgConnector = await connectToMatchesDatabase()
})

afterEach(async () => {
    await dropItemsCollections()
    await clearMatchesTable(pgConnector)
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
        await addMatch(pgConnector)
        const res = await request(app).get("/matches/a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addMatch(pgConnector)
        const res = await request(app).get("/matches/a0ee-bc99-9c0b-4ef8-bb6d-6bb9-bd38-0a11")
        expect(res.body.success).toBe(true)
        expect(res.body.match).toHaveProperty("id")
        expect(res.body.match).toHaveProperty("found_id")
        expect(res.body.match).toHaveProperty("lost_id")
        expect(res.body.match).toHaveProperty("match_probability")
    })
})

describe("GET /matches/lost/<lostId>", () => {
    it("should return 404", async () => {
        const res = await request(app).get("/matches/lost/64202bd46d22797759e9888c")
        expect(res.statusCode).toEqual(404)
    })

    it("should return 400", async () => {
        const res = await request(app).get("/matches/lost/invalid")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 200", async () => {
        await addMatch(pgConnector)
        const res = await request(app).get("/matches/lost/64202be6be38a05973e0c6c7")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addMatches(pgConnector)
        const res = await request(app).get("/matches/lost/64202be6be38a05973e0c6c7")
        expect(res.body.success).toBe(true)
        expect(res.body.matches).toHaveLength(2)
        expect(res.body.matches[0]).toHaveProperty("id")
        expect(res.body.matches[0]).toHaveProperty("found_id")
        expect(res.body.matches[0]).toHaveProperty("lost_id")
        expect(res.body.matches[0]).toHaveProperty("match_probability")
    })
})

describe("GET /matches/found/<foundId>", () => {
    it("should return 404", async () => {
        const res = await request(app).get("/matches/found/64202bd46d22797759e9888c")
        expect(res.statusCode).toEqual(404)
    })

    it("should return 400", async () => {
        const res = await request(app).get("/matches/found/invalid")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 200", async () => {
        await addMatch(pgConnector)
        const res = await request(app).get("/matches/found/64202bd46d22797759e9888c")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addMatches(pgConnector)
        const res = await request(app).get("/matches/found/64202bd46d22797759e9888c")
        expect(res.body.success).toBe(true)
        expect(res.body.matches).toHaveLength(2)
        expect(res.body.matches[0]).toHaveProperty("id")
        expect(res.body.matches[0]).toHaveProperty("found_id")
        expect(res.body.matches[0]).toHaveProperty("lost_id")
        expect(res.body.matches[0]).toHaveProperty("match_probability")
    })
})

describe("POST /matches", () => {
    it("should return 400", async () => {
        const res = await request(app).post("/matches")
        expect(res.statusCode).toEqual(400)
    })

    it("should return 201", async () => {
        const res = await request(app).post("/matches").send({
            foundId: "64202bd46d22797759e9888c",
            lostId: "64202be6be38a05973e0c6c7",
            matchProbability: 0.5,
        })
        expect(res.statusCode).toEqual(201)
    })

    it("should have correct response body", async () => {
        const res = await request(app).post("/matches").send({
            foundId: "64202bd46d22797759e9888c",
            lostId: "64202be6be38a05973e0c6c7",
            matchProbability: 0.5,
        })
        expect(res.body.success).toBe(true)
        expect(res.body.match).toHaveProperty("id")
        expect(res.body.match).toHaveProperty("foundId")
        expect(res.body.match).toHaveProperty("lostId")
        expect(res.body.match).toHaveProperty("matchProbability")
    })
})
