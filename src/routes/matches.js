const express = require("express")
const { getMatchesByFoundId, getMatchesByLostId, insertMatch, getMatchById, insertMatchesBatch } = require("../services/matchesService")

const router = express.Router()

router.get("/lost/:lostId", async (req, res) => {
    const result = await getMatchesByLostId(req.params.lostId)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

router.get("/found/:foundId", async (req, res) => {
    const result = await getMatchesByFoundId(req.params.foundId)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

router.get("/:matchId", async (req, res) => {
    const result = await getMatchById(req.params.matchId)
    if (result.success === false) {
        if (result.error.message === "Match not found") {
            return res.status(404).json(result)
        }
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

router.post("/", async (req, res) => {
    const result = await insertMatch(req.body)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(201).json(result)
})

router.post("/batch", async (req, res) => {
    const result = await insertMatchesBatch(req.body)
    if (result.success === false) {
        return res.status(400).json(result)
    }
    res.status(201).json(result)
})

module.exports = router
