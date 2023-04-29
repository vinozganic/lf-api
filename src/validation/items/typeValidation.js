const typeValidation = (body) => {
    const { type } = body

    const validTypes = [
        "tshirt",
        "shirt",
        "lstshirt",
        "trousers",
        "jeans",
        "shorts",
        "sweatpants",
        "sweatshirt",
        "jacket",
        "cap",
        "hat",
        "scarf",
        "gloves",
        "belt",
        "skirt",
        "dress",
        "sneakers",
        "shoes",
        "boots",
        "underpants",
        "socks",
        "other",
        "ring",
        "necklace",
        "earring",
        "anklet",
        "bracelet",
        "chain",
        "sunglasses",
        "glasses",
        "umbrella",
        "keys",
        "book",
        "wristwatch",
        "ball",
        "pillow",
        "racket",
        "bat",
        "skis",
        "wallet",
        "bag",
        "purse",
        "backpack",
        "idCard",
        "drivingLicense",
        "passport",
        "other",
        "mobilePhone",
        "laptop",
        "tablet",
        "smartWatch",
        "usbstick",
        "wiredHeadphones",
        "wirelessHeadphones",
        "camera",
        "mouse",
        "keyboard",
    ]

    if (!validTypes.includes(type)) {
        return {
            success: false,
            error: {
                message: "Invalid type.",
                invalidType: type,
                validTypes,
            },
        }
    }

    return {
        success: true,
    }
}

module.exports = typeValidation
