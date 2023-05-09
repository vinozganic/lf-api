const request = require("supertest")
const app = require("../../src/app")
const { connectToItemsDatabase, dropItemsCollections, dropItemsDatabase } = require("../dbHandler")

beforeAll(async () => await connectToItemsDatabase())
afterEach(async () => await dropItemsCollections())
afterAll(async () => await dropItemsDatabase())

jest.mock("../../src/db", () => ({
    ...jest.requireActual("../../src/db"),
    sendToQueue: jest.fn(),
}))

describe("POST /found", () => {
    it("should raise an error for invalid payload", async () => {
        const res = await request(app).post("/found").send({
            type: "mobilePhone",
        })

        expect(res.statusCode).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body).toHaveProperty("error")
    })

    it("should create a new found item", async () => {
        const res = await request(app)
            .post("/found")
            .send({
                type: "mobilePhone",
                color: [1, 2, 3],
                date: new Date(),
                location: {
                    path: {
                        type: "Point",
                        coordinates: [1, 2],
                    },
                },
                phoneNumber: "+385981234567",
            })

        expect(res.statusCode).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveProperty("_id")
        expect(res.body.data).toHaveProperty("type")
        expect(res.body.data).toHaveProperty("color")
        expect(res.body.data).toHaveProperty("date")
        expect(res.body.data).toHaveProperty("location")
    })

    it("should create a tracking key for found item", async () => {
        const res = await request(app)
            .post("/found")
            .send({
                type: "mobilePhone",
                color: [1, 2, 3],
                date: new Date(),
                location: {
                    path: {
                        type: "Point",
                        coordinates: [1, 2],
                    },
                },
                phoneNumber: "+385981234567",
            })

        expect(res.statusCode).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveProperty("trackingKey")
    })
})

describe("GET /found", () => {
    it("should return 200", async () => {
        const res = await request(app).get("/found")
        expect(res.statusCode).toEqual(200)
    })

    it("should have correct response body", async () => {
        const res = await request(app).get("/found")
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeInstanceOf(Array)
        res.body.data.forEach((item) => {
            expect(item).toHaveProperty("_id")
            expect(item).toHaveProperty("type")
            expect(item).toHaveProperty("color")
            expect(item).toHaveProperty("date")
            expect(item).toHaveProperty("location")
            expect(item).toHaveProperty("trackingKey")
        })
    })
})

describe("POST /found/batch", () => {
    it("should return 200", async () => {
        const res = await request(app).post("/found/batch").send(["64328ac8364179d5379fed98", "64328d2f364179d5379fed9a"])
        expect(res.statusCode).toBe(200)
    })

    it("should have correct response body", async () => {
        const res = await request(app).post("/found/batch").send(["64328ac8364179d5379fed98", "64328d2f364179d5379fed9a"])
        expect(res.body.success).toBe(true)
        expect(res.body.data).toBeInstanceOf(Array)
    })
})
