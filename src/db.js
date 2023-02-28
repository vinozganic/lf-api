const mongoose = require("mongoose")
const { Client } = require("pg")

const connectToMongo = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            console.log("Connected to MongoDB")
        }
    } catch (error) {
        console.log(error)
    }
}

const client = new Client({
    connectionString: process.env.POSTGRES_URI,
})

const connectToPostgres = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await client.connect()
            console.log("Connected to PostgreSQL")
            const results = await client.query(`
                SELECT EXISTS (
                    SELECT 1
                    FROM pg_catalog.pg_tables
                    WHERE schemaname = 'public'
                    AND tablename = 'matches'
                );
            `)
            const tableExists = results.rows[0].exists
            if (!tableExists) {
                console.log("Creating table matches.")
                await client.query(`
                    CREATE TABLE matches (
                        id SERIAL PRIMARY KEY,
                        found_id INTEGER NOT NULL,
                        lost_id INTEGER NOT NULL,
                        matchProbability NUMERIC(7,6) NOT NULL
                    );
                `)
                console.log("Created table matches.")
            } else {
                console.log("Table matches exists.")
            }
        } 
    } catch (error) {
        console.log(error)
    } finally {
        await client.end()
    }
}

const Schema = mongoose.Schema

const foundSchema = new Schema({}, { strict: false })
const Found = mongoose.model("found", foundSchema)

const lostSchema = new Schema({}, { strict: false })
const Lost = mongoose.model("lost", lostSchema)

module.exports = { Found, Lost, connectToMongo, connectToPostgres }
