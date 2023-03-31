const express = require("express")
const { addFound, getFoundBatch } = require("../services/foundService")

const router = express.Router()

router.post("/", async (req, res) => {
    const data = await addFound(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(201).json(data)
})

router.post("/batch", async (req, res) => {
    const data = await getFoundBatch(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

module.exports = router
