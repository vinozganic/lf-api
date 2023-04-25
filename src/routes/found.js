const express = require("express")
const { addFound, getFound, getFoundBatch } = require("../services/foundService")
const { generateItemToProcessMessage } = require("../helpers/generateMessage")
const { sendToQueue } = require("../db")

const router = express.Router()

router.post("/", async (req, res) => {
    const result = await addFound(req.body)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    const message = generateItemToProcessMessage(result.data, "found")
    await sendToQueue(message)
    res.status(201).json(result)
})

router.get("/", async (req, res) => {
    const result = await getFound()
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

router.post("/batch", async (req, res) => {
    const result = await getFoundBatch(req.body)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

module.exports = router
