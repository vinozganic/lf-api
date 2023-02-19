const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const foundRouter = require("./routes/found")
const lostRouter = require("./routes/lost")
const { connect } = require("./db")

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())

var corsOptions = {
    origin: process.env.FRONTEND_URL,
}

app.use(cors(corsOptions))

app.use("/found", foundRouter)
app.use("/lost", lostRouter)

connect()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
