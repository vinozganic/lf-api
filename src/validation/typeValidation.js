const typeValidation = (body) => {
    const { type, subtype } = body
    const validTypes = ["clothes", "misc", "tech"]
    if (!validTypes.includes(type)) {
        return {
            success: false,
            error: {
                message: "Invalid type",
                invalidType: type,
                validTypes,
            },
        }
    }
    const validSubTypes = {
        clothes: [
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
        ],
        misc: [
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
        ],
        tech: [
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
        ],
    }

    if (!validSubTypes[type].includes(subtype)) {
        return {
            success: false,
            error: {
                message: "Invalid subtype",
                invalidSubtype: subtype,
                validSubtypes: validSubTypes[type],
            },
        }
    }

    return {
        success: true,
    }
}

module.exports = typeValidation
