const { Found } = require("../db")

const addFound = async (body) => {
    const newFound = new Found(body)
    await newFound.save()
    return newFound
}

module.exports = { addFound }
