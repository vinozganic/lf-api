const { Found, Lost } = require("./db");

const getItemByTrackingKey = async (trackingKey) => {
    try {
        const lostItem = await Lost.findOne({trackingKey: trackingKey})
        if(lostItem) {
            return {
                success: true,
                item: {
                    id: lostItem._id,
                    type: "lost"
                }
            }
        }

        const foundItem = await Found.findOne({trackingKey: trackingKey})
        if(foundItem) {
            return {
                success: true,
                item: {
                    id: foundItem._id, 
                    type: "found"
                }
            }
        }
        return {
            success: false,
            error: {
                message: "Item not found for given tracking key"
            }
        }

    } catch(error) {
        console.log(error)
        return {
            success: false,
            error
        }
    }
}

module.exports = { getItemByTrackingKey }
