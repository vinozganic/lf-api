const app = require("./app")
const { connectToMongo, connectToConfig, connectToMatches, connectToQueue } = require("./db")

const PORT = process.env.PORT || 8000

app.listen(PORT, async () => {
    await connectToMongo()
    await connectToMatches()
    await connectToConfig()
    await connectToQueue()
    console.log(`Server running on port ${PORT}`)
})
