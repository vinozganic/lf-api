const express = require("express")
const { getItemByTrackingKey } = require("../services/trackService")

const router = express.Router()

router.get("/:trackingKey", async (req, res) => {
    const data = await getItemByTrackingKey(req.params.trackingKey)
    if (data.success === false) {
        if (data.error.message === "Item not found for given tracking key") {
            return res.status(404).json(data)
        }
        return res.status(400).json(data)
    }
    res.status(200).json(data)
})

module.exports = router
