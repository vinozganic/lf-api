const { Found } = require("../db")

const addFound = async (body) => {
    const validTypes = ["clothes", "tech", "misc"]
    if (!validTypes.includes(body.type)) {
        return { error: "Invalid type" }
    }
    const newFound = new Found(body)
    await newFound.save()
    return newFound
}

module.exports = { addFound }
