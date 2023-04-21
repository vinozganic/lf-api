const express = require("express")
const { addLost, getLost, getLostBatch, resolve } = require("../services/lostService")

const router = express.Router()

router.post("/", async (req, res) => {
    const data = await addLost(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(201).json(data)
})

router.get("/", async (req, res) => {
    const data = await getLost()
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

router.post("/batch", async (req, res) => {
    const data = await getLostBatch(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

router.post("/resolve", async (req, res) => {
    const data = await resolve(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

module.exports = router
