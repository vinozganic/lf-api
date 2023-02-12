const express = require("express")

const router = express.Router()

router.post("/", (req, res) => {
    res.send("POST request to the lost route")
})

module.exports = router
