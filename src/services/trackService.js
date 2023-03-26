const { Found, Lost } = require("./db");
const validate = require("./validation/items/validation");

const getItemByTrackingKey = async (trackingKey) => {
    
    try{
        const validationResult = validate(trackingKey)
        if(!validationResult.success){
            return validationResult;
        }
        const lostItem = await Lost.findOne({trackingKey: trackingKey})
        if(lostItem){
            return {
                success: true,
                item: {
                    id: lostItem._id,
                    type: "lost"
                }
            }
        }

        const foundItem = await Found.findOne({trackingKey: trackingKey})
        if(foundItem){
            return {
                success: true,
                item: {
                    id: foundItem._id, 
                    type: "found"
                }
            }
        }

    }catch(error){
        console.log(error)
        return {
            success: false,
            error
        }
    }
}

module.exports = { getItemByTrackingKey }
