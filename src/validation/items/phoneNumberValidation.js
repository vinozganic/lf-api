const validatePhoneNumber = (body) => {
    const { phoneNumber } = body

    if (typeof phoneNumber !== "string") {
        return {
            success: false,
            error: {
                message: "Invalid phone number. Phone number must be a string.",
            },
        }
    }
    const regex =
        /(\+|00)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/
    const match = phoneNumber.match(regex)
    if (!match) {
        return {
            success: false,
            error: {
                message: "Invalid phone number.",
            },
        }
    }
    return { success: true }
}

module.exports = validatePhoneNumber
