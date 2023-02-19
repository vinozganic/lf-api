const mongoose = require("mongoose")

const connect = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            console.log("Connected to MongoDB")
        }
    } catch (error) {
        console.log(error)
    }
}

const Schema = mongoose.Schema

const foundSchema = new Schema({}, { strict: false })
const Found = mongoose.model("found", foundSchema)

const lostSchema = new Schema({}, { strict: false })
const Lost = mongoose.model("lost", lostSchema)

module.exports = { Found, Lost, connect }
