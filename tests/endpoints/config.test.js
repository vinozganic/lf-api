const request = require("supertest")
const app = require("../../src/app")
const { connectToConfigDatabase, clearConfigTables, addArea, addTypes, addTransportLine } = require("../dbHandler")

let configConnector = null

beforeAll(async () => {
    configConnector = await connectToConfigDatabase()
})

afterEach(async () => {
    await clearConfigTables(configConnector)
})

describe("GET /config/areas", () => {
    it("should return 200", async () => {
        await addArea(configConnector)
        const res = await request(app).get("/config/areas")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addArea(configConnector)
        const res = await request(app).get("/config/areas")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeInstanceOf(Array)
        res.body.data.forEach((area) => {
            expect(area).toHaveProperty("name")
            expect(area).toHaveProperty("geo_json")
        })
    })
})

describe("GET /config/types", () => {
    it("should return 200", async () => {
        await addTypes(configConnector)
        const res = await request(app).get("/config/types")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addTypes(configConnector)
        const res = await request(app).get("/config/types")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeInstanceOf(Array)
    })
})

describe("GET /config/transportLines", () => {
    it("should return 200", async () => {
        await addArea(configConnector)
        await addTransportLine(configConnector)
        const res = await request(app).get("/config/transportLines/Zagreb")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addArea(configConnector)
        await addTransportLine(configConnector)
        const res = await request(app).get("/config/transportLines/Zagreb")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeInstanceOf(Object)
        expect(res.body.data).toHaveProperty("areaName")
        expect(res.body.data.transportLines).toBeInstanceOf(Array)
        res.body.data.transportLines.forEach((line) => {
            expect(line).toHaveProperty("id")
            expect(line).toHaveProperty("areaName")
            expect(line).toHaveProperty("type")
            expect(line).toHaveProperty("name")
            expect(line).toHaveProperty("number")
            expect(line).toHaveProperty("geoJson")
        })
    })
})
