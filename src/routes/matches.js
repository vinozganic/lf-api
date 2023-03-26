const express = require("express")
const { getMatchesByFoundId, getMatchesByLostId, insertMatch, getMatchById } = require("../services/matchesService")

const router = express.Router()

router.get("/lost/:lostId", async (req, res) => {
    const data = await getMatchesByLostId(req.params.lostId)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

router.get("/found/:foundId", async (req, res) => {
    const data = await getMatchesByFoundId(req.params.foundId)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

router.get("/:matchId", async (req, res) => {
    const data = await getMatchById(req.params.matchId)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

router.post("/", async (req, res) => {
    const data = await insertMatch(req.body)
    if (data.success === false) {
        return res.status(400).json(data)
    }
    res.status(201).json(data)
})

module.exports = router
