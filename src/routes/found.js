const express = require("express")
const { addFound } = require("../services/foundService")

const router = express.Router()

router.post("/", async (req, res) => {
    const data = await addFound(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(201).json(data)
})

module.exports = router
