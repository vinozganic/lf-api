const app = require("./app")
const { connectToMongo, connectToPostgres } = require("./db")

connectToMongo()
connectToPostgres()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
