const app = require("./app")
const { connectToMongo, connectToConfig, connectToMatches } = require("./db")

connectToMongo()
connectToMatches()
connectToConfig()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
