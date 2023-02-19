const express = require("express")
const { addLost } = require("../services/lostService")

const router = express.Router()

router.post("/", async (req, res) => {
    const data = await addLost(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(201).json(data)
})

module.exports = router
