const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
let mongod = null

module.exports.connect = async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: true,
        w: "majority",
        wtimeoutMS: 10000,
    }
    await mongoose.connect(uri, mongooseOpts)
}

module.exports.dropDatabase = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
}

module.exports.dropCollections = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany()
    }
}
