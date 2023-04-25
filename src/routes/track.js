const express = require("express")
const { getItemByTrackingKey } = require("../services/trackService")

const router = express.Router()

router.get("/:trackingKey", async (req, res) => {
    const result = await getItemByTrackingKey(req.params.trackingKey)
    if (result.success === false) {
        if (result.error.message === "Item not found for given tracking key") {
            return res.status(404).json(result)
        }
        return res.status(400).json(result)
    }
    res.status(200).json(result)
})

module.exports = router
