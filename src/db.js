const mongoose = require("mongoose")

const Schema = mongoose.Schema

const foundSchema = new Schema({}, { strict: false })
const Found = mongoose.model("found", foundSchema)

const lostSchema = new Schema({}, { strict: false })
const Lost = mongoose.model("lost", lostSchema)

module.exports = { Found, Lost }
