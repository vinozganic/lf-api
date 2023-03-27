const express = require("express")
const cors = require("cors")
const foundRouter = require("./routes/found")
const lostRouter = require("./routes/lost")
const matchesRouter = require("./routes/matches")
const trackRouter = require("./routes/track")

const app = express()
app.use(express.json())

var corsOptions = {
    origin: process.env.FRONTEND_URL,
}

app.use(cors(corsOptions))

app.use("/found", foundRouter)
app.use("/lost", lostRouter)
app.use("/matches", matchesRouter)
app.use("/track", trackRouter)

module.exports = app
