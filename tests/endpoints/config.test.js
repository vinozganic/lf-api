const request = require("supertest")
const app = require("../../src/app")
const { connectToConfigDatabase, clearConfigTables, addArea, addTypesAndSubtypes, addTransportLine } = require("../dbHandler")

let configConnector = null

beforeAll(async () => {
    configConnector = await connectToConfigDatabase()
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
            expect(area).toHaveProperty("id")
            expect(area).toHaveProperty("name")
            expect(area).toHaveProperty("geo_json")
        })
    })
})

describe("GET /config/types", () => {
    it("should return 200", async () => {
        await addTypesAndSubtypes(configConnector)
        const res = await request(app).get("/config/types")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addTypesAndSubtypes(configConnector)
        const res = await request(app).get("/config/types")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeInstanceOf(Object)
        Object.keys(res.body.data).forEach((key) => {
            expect(res.body.data[key]).toBeInstanceOf(Array)
        })
    })
})

describe("GET /config/transportLines", () => {
    it("should return 200", async () => {
        await addArea(configConnector)
        await addTransportLine(configConnector)
        const res = await request(app).get("/config/transportLines/1")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        await addArea(configConnector)
        await addTransportLine(configConnector)
        const res = await request(app).get("/config/transportLines/1")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeInstanceOf(Object)
        expect(res.body.data).toHaveProperty("areaName")
        expect(res.body.data.transportLines).toBeInstanceOf(Array)
        res.body.data.transportLines.forEach((line) => {
            expect(line).toHaveProperty("id")
            expect(line).toHaveProperty("areaId")
            expect(line).toHaveProperty("type")
            expect(line).toHaveProperty("name")
            expect(line).toHaveProperty("number")
            expect(line).toHaveProperty("geoJson")
        })
    })
})
