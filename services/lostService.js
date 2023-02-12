const { Lost } = require("../db")

const addLost = async (body) => {
    const newLost = new Lost(body)
    await newLost.save()
    return newLost
}

module.exports = { addLost }
