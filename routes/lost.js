const express = require("express")
const { addLost } = require("../services/lostService")

const router = express.Router()

router.post("/", async (req, res) => {
    const newLost = await addLost(req.body)
    res.status(201).json(newLost)
})

module.exports = router
