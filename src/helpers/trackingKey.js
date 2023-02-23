const generateKey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let key = ""
    for (let i = 0; i < 8; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return key
}

module.exports = { generateKey }
