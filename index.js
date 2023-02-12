const express = require("express")
const foundRouter = require("./routes/found")
const lostRouter = require("./routes/lost")

require("dotenv").config()

const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())

app.use("/found", foundRouter)
app.use("/lost", lostRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
