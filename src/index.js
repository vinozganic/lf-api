const app = require("./app")
const { connectToMongo, connectToConfig, connectToMatches, connectToQueue } = require("./db")

connectToMongo()
connectToMatches()
connectToConfig()
connectToQueue()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
