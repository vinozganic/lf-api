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

describe("lost endpoint", () => {
    it("should raise an error for invalid payload", async () => {
        const res = await request(app).post("/lost").send({
            type: "tech",
        })

        expect(res.statusCode).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body).toHaveProperty("error")
    })

    it("should create a new lost item", async () => {
        const res = await request(app)
            .post("/lost")
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
        expect(res.body.data).toHaveProperty("_id")
        expect(res.body.data).toHaveProperty("type")
        expect(res.body.data).toHaveProperty("subtype")
        expect(res.body.data).toHaveProperty("color")
        expect(res.body.data).toHaveProperty("date")
        expect(res.body.data).toHaveProperty("location")
        expect(res.body.data).toHaveProperty("identifiable")
    })

    it("should create a tracking key for lost item", async () => {
        const res = await request(app)
            .post("/lost")
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
        expect(res.body.data).toHaveProperty("trackingKey")
    })
})
