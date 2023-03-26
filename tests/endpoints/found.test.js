const request = require("supertest")
const app = require("../../src/app")
const { connectToItemsDatabase, dropItemsCollections, dropItemsDatabase } = require("../dbHandler")

beforeAll(async () => await connectToItemsDatabase())
afterEach(async () => await dropItemsCollections())
afterAll(async () => await dropItemsDatabase())

describe("Found endpoint", () => {
    it("should raise an error for invalid payload", async () => {
        const res = await request(app).post("/found").send({
            type: "tech",
        })

        expect(res.statusCode).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body).toHaveProperty("error")
    })

    it("should create a new found item", async () => {
        const res = await request(app)
            .post("/found")
            .send({
                type: "tech",
                subtype: "mobilePhone",
                color: [1, 2, 3],
                date: new Date(),
                location: {
                    type: "Point",
                    coordinates: [1, 2],
                },
                identifiable: true,
                phoneNumber: "+385981234567",
            })

        expect(res.statusCode).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.found).toHaveProperty("_id")
        expect(res.body.found).toHaveProperty("type")
        expect(res.body.found).toHaveProperty("subtype")
        expect(res.body.found).toHaveProperty("color")
        expect(res.body.found).toHaveProperty("date")
        expect(res.body.found).toHaveProperty("location")
        expect(res.body.found).toHaveProperty("identifiable")
    })

    it("should create a tracking key for found item", async () => {
        const res = await request(app)
            .post("/found")
            .send({
                type: "tech",
                subtype: "mobilePhone",
                color: [1, 2, 3],
                date: new Date(),
                location: {
                    type: "Point",
                    coordinates: [1, 2],
                },
                identifiable: true,
                phoneNumber: "+385981234567",
            })

        expect(res.statusCode).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.found).toHaveProperty("trackingKey")
    })
})
