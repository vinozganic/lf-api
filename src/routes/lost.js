const express = require("express")
const { addLost, getLost, getLostBatch, resolve } = require("../services/lostService")
const { generateItemToProcessMessage } = require("../helpers/generateMessage")
const { sendToQueue } = require("../db")

const router = express.Router()

router.post("/", async (req, res) => {
    const result = await addLost(req.body)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    const message = generateItemToProcessMessage(result.data, "lost")
    await sendToQueue(message)
    res.status(201).json(result)
})

router.get("/", async (req, res) => {
    const result = await getLost()
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

router.post("/batch", async (req, res) => {
    const result = await getLostBatch(req.body)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

router.post("/resolve", async (req, res) => {
    const result = await resolve(req.body)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

module.exports = router
