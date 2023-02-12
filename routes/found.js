const express = require("express")
const { addFound } = require("../services/foundService")

const router = express.Router()

router.post("/", async (req, res) => {
    const newFound = await addFound(req.body)
    res.status(201).json(newFound)
})

module.exports = router
