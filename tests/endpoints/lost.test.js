const request = require("supertest")
const app = require("../../src/app")
const { connect, dropDatabase, dropCollections } = require("../dbHandler")

beforeAll(async () => await connect())
afterEach(async () => await dropCollections())
afterAll(async () => await dropDatabase())

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
        expect(res.body.lost).toHaveProperty("_id")
        expect(res.body.lost).toHaveProperty("type")
        expect(res.body.lost).toHaveProperty("subtype")
        expect(res.body.lost).toHaveProperty("color")
        expect(res.body.lost).toHaveProperty("date")
        expect(res.body.lost).toHaveProperty("location")
        expect(res.body.lost).toHaveProperty("identifiable")
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
        expect(res.body.lost).toHaveProperty("trackingKey")
    })
})
