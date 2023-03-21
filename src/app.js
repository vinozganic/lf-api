const express = require("express")
const cors = require("cors")
const foundRouter = require("./routes/found")
const lostRouter = require("./routes/lost")
const { connectToMongo, connectToPostgres } = require("./db")

const app = express()
app.use(express.json())

var corsOptions = {
    origin: process.env.FRONTEND_URL,
}

app.use(cors(corsOptions))

app.use("/found", foundRouter)
app.use("/lost", lostRouter)

module.exports = app
