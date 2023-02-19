const validatePhoneNumber = (body) => {
    const { phoneNumber } = body

    if (!phoneNumber) {
        return { 
            success : false,
            error : {
                message : "Missing phone number."
            }
        }
    }
    if (typeof phoneNumber !== "string") {
        return { 
            success : false,
            error : {
                message : "Invalid phone number. Phone number must be a string."
            }
        }
    }
    // 250 monthly requests free 
    // 1 request per second
    fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.PHONE_VALIDATION_API_KEY}&phone=${phoneNumber}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.valid) {
                return { success : true }
            }
            return { 
                success : false,
                error : {
                    data
                }    
            }
        })
        .catch((error) => {
            console.log(error)
            return { 
                success : false,
                error : {
                    message : "Error validating phone number."
                }
            }
        })
}

module.exports = validatePhoneNumber