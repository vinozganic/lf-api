const express = require("express")
const { addFound } = require("../services/foundService")

const router = express.Router()

router.post("/", async (req, res) => {
    const newFound = await addFound(req.body)
    if (newFound.message === "Invalid type") {
        return res.status(400).json({ message: "Invalid type" })
    }
    res.status(201).json(newFound)
})

module.exports = router