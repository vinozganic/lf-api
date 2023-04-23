const express = require("express")
const cors = require("cors")
const foundRouter = require("./routes/found")
const lostRouter = require("./routes/lost")
const matchesRouter = require("./routes/matches")
const trackRouter = require("./routes/track")
const configRouter = require("./routes/config")

const app = express()
app.use(express.json())

const corsWhitelist = [process.env.FRONTEND_URL, process.env.MATCHER_URL]
var corsOptions = {
    origin: function (origin, callback) {
        if (origin === undefined || corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
}

app.use(cors(corsOptions))

app.use("/found", foundRouter)
app.use("/lost", lostRouter)
app.use("/matches", matchesRouter)
app.use("/track", trackRouter)
app.use("/config", configRouter)

module.exports = app
