const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const foundRouter = require("./routes/found")
const lostRouter = require("./routes/lost")

require("dotenv").config()

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use(cors())

var corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use("/found", foundRouter)
app.use("/lost", lostRouter)

const startMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}

startMongo()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
