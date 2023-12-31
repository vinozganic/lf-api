const express = require("express")
const { getAreas, getTypes, getTransportLines } = require("../services/configService")

const router = express.Router()

router.get("/areas", async (req, res) => {
    const data = await getAreas()
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

router.get("/types", async (req, res) => {
    const data = await getTypes()
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

router.get("/transportLines/:areaName", async (req, res) => {
    const data = await getTransportLines(req.params.areaName)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

module.exports = router
